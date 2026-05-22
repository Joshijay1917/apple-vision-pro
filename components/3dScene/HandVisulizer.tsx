'use client';

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useHandTracking } from "@/context/HandTrackingContext";
import { useApplication } from "@/context/ApplicationContext";
import { Html } from "@react-three/drei";

const BONE_PAIRS = [
  [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // Index
  [9, 10], [10, 11], [11, 12],    // Middle
  [13, 14], [14, 15], [15, 16],   // Ring
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17] // Palm
];

const JOINT_COUNT = 21;
const BONE_COUNT = BONE_PAIRS.length;
const MAX_HANDS = 2;

export function HandVisualizer() {
  const { handsRef } = useHandTracking();
  const { focusedBrowserId } = useApplication();
  const jointMeshRef = useRef<THREE.InstancedMesh>(null);
  const boneMeshRef = useRef<THREE.InstancedMesh>(null);
  const cursorMeshRef = useRef<THREE.InstancedMesh>(null);

  const tempObject = useMemo(() => new THREE.Object3D(), []);

  const vStart = useMemo(() => new THREE.Vector3(), []);
  const vEnd = useMemo(() => new THREE.Vector3(), []);
  const vDir = useMemo(() => new THREE.Vector3(), []);
  const vIndexPip = useMemo(() => new THREE.Vector3(), []);
  const vIndexTip = useMemo(() => new THREE.Vector3(), []);
  const vThumbTip = useMemo(() => new THREE.Vector3(), []);
  const vThumbPip = useMemo(() => new THREE.Vector3(), []);
  const vMidpoint = useMemo(() => new THREE.Vector3(), []);

  const tempColor = useMemo(() => new THREE.Color(), []);

  // Store previous frames' data to apply Exponential Moving Average (EMA) smoothing
  const smoothingRef = useRef<{ origin: THREE.Vector3, dir: THREE.Vector3 }[]>([
    { origin: new THREE.Vector3(), dir: new THREE.Vector3() },
    { origin: new THREE.Vector3(), dir: new THREE.Vector3() }
  ]);

  // Pre-allocate Vector3 arrays for joint smoothing to avoid GC thrashing in useFrame (60fps)
  const smoothedJointsRef = useRef<THREE.Vector3[][]>(
    Array.from({ length: MAX_HANDS }, () =>
      Array.from({ length: JOINT_COUNT }, () => new THREE.Vector3())
    )
  );

  // Pre-allocate Vector3 arrays for final cursor plane smoothing to achieve absolute dead-zone stability
  const smoothedCursorPosRef = useRef<THREE.Vector3[]>(
    Array.from({ length: MAX_HANDS }, () => new THREE.Vector3())
  );

  // Interaction State
  const isPinchingRef = useRef<boolean[]>([false, false]);
  const hoveredElementRef = useRef<(Element | null)[]>([null, null]);

  useFrame((state) => {
    const hands = handsRef.current;

    if (!jointMeshRef.current || !boneMeshRef.current || !cursorMeshRef.current) return;

    // Reset global DOM cursors by default (will be repositioned and shown if active and tracking)
    const cursor0 = document.getElementById('spatial-cursor-0');
    const cursor1 = document.getElementById('spatial-cursor-1');
    if (cursor0) cursor0.style.opacity = '0';
    if (cursor1) cursor1.style.opacity = '0';

    if (!hands || hands.length === 0) {
      jointMeshRef.current.count = 0;
      boneMeshRef.current.count = 0;
      cursorMeshRef.current.count = 0;

      // Reset smoothing data when hands are lost
      smoothingRef.current[0].origin.set(0, 0, 0);
      smoothingRef.current[1].origin.set(0, 0, 0);

      for (let h = 0; h < MAX_HANDS; h++) {
        smoothedCursorPosRef.current[h].set(0, 0, 0);
        for (let i = 0; i < JOINT_COUNT; i++) {
          smoothedJointsRef.current[h][i].set(0, 0, 0);
        }
      }

      // Reset previous pinch tracking
      isPinchingRef.current[0] = false;
      isPinchingRef.current[1] = false;

      // Clear hover state for both hands
      for (let h = 0; h < 2; h++) {
        const hoverd = hoveredElementRef.current[h];
        if (hoverd) {
          hoverd.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
          hoverd.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false }));
          hoveredElementRef.current[h] = null;
        }
      }
      return;
    }

    jointMeshRef.current.count = hands.length * JOINT_COUNT;
    boneMeshRef.current.count = hands.length * BONE_COUNT;
    cursorMeshRef.current.count = hands.length;

    // Config for Vision Pro style placement
    const scale = 5.5;
    const offsetZ = -1.2;
    const offsetY = -0.5;

    // Camera FOV mapping (approximate for 640x480 webcam)
    const viewWidth = 2.0; // Units across at offsetZ
    const viewHeight = 1.5;

    for (let h = 0; h < Math.min(hands.length, MAX_HANDS); h++) {
      const hand = hands[h];
      const keypoints3D = hand.keypoints3D;
      const keypoints2D = hand.keypoints; // Pixel coordinates (x: 0-640, y: 0-480)

      if (!keypoints3D || !keypoints2D || keypoints3D.length < 21 || !keypoints2D[0]) continue;

      // Calculate the hand's center in screen space (-0.5 to 0.5)
      // Mirror the X because webcams are mirrored
      const screenX = (keypoints2D[0].x / 640) - 0.5;
      const screenY = (keypoints2D[0].y / 480) - 0.5;

      // Map screen space to 3D world space at the current offsetZ
      const worldOffsetX = -screenX * viewWidth * 2; // Inverted for mirror
      const worldOffsetY = -screenY * viewHeight * 2;

      // 1. Update Joints with Anti-Jitter Exponential Moving Average (EMA)
      for (let i = 0; i < JOINT_COUNT; i++) {
        const kp = keypoints3D[i];
        const idx = h * JOINT_COUNT + i;

        // Calculate raw target 3D space position
        const targetX = -kp.x * scale + worldOffsetX;
        const targetY = -kp.y * scale + worldOffsetY + offsetY;
        const targetZ = kp.z * scale + offsetZ;

        const smoothedPos = smoothedJointsRef.current[h][i];
        vStart.set(targetX, targetY, targetZ);

        // If newly tracked or teleported (tracking jump), snap immediately
        if (smoothedPos.lengthSq() === 0 || smoothedPos.distanceTo(vStart) > 1.5) {
          smoothedPos.copy(vStart);
        } else {
          // Extremely smooth and natural EMA tracking coefficient (16% new, 84% history)
          smoothedPos.lerp(vStart, 0.16);
        }

        tempObject.position.copy(smoothedPos);
        tempObject.scale.set(1, 1, 1);
        tempObject.rotation.set(0, 0, 0);
        tempObject.updateMatrix();
        jointMeshRef.current.setMatrixAt(idx, tempObject.matrix);
      }

      // 2. Update Bones using the smoothed joints
      for (let j = 0; j < BONE_COUNT; j++) {
        const [startIdx, endIdx] = BONE_PAIRS[j];

        vStart.copy(smoothedJointsRef.current[h][startIdx]);
        vEnd.copy(smoothedJointsRef.current[h][endIdx]);

        const dist = vStart.distanceTo(vEnd);
        if (dist < 0.0001) continue;

        vDir.subVectors(vEnd, vStart).normalize();

        tempObject.position.copy(vStart).add(vEnd).multiplyScalar(0.5);
        tempObject.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vDir);
        tempObject.scale.set(1, dist, 1);
        tempObject.updateMatrix();
        boneMeshRef.current.setMatrixAt(h * BONE_COUNT + j, tempObject.matrix);
      }

      // 3. Update Laser Pointer & Midpoints using smoothed joints
      const vWrist = smoothedJointsRef.current[h][0];  // Wrist (joint 0)
      vThumbTip.copy(smoothedJointsRef.current[h][4]); // Thumb Tip
      vIndexTip.copy(smoothedJointsRef.current[h][8]); // Index Tip

      // --- PINCH DETECTION ---
      // Measure physical distance between the smoothed thumb and index finger tips
      const pinchDistance = vThumbTip.distanceTo(vIndexTip);
      const isPinching = pinchDistance < 0.25; // Click threshold

      // The pinch midpoint acts as the pointing target/reticle
      vMidpoint.addVectors(vThumbTip, vIndexTip).multiplyScalar(0.5);

      // Pointing vector is defined from the wrist through the pinch midpoint!
      // Compensate for natural upward hand posture tilt by adding a slight downward offset (-0.22)
      // to make pointing and clicking in the lower 50% of the screen comfortable and effortless.
      vDir.subVectors(vMidpoint, vWrist);
      vDir.y -= 0.22;
      vDir.normalize();

      const smoothed = smoothingRef.current[h];

      // If hand just appeared or teleported, snap immediately
      if (smoothed.origin.lengthSq() === 0 || smoothed.origin.distanceTo(vWrist) > 2.0) {
        smoothed.origin.copy(vWrist);
        smoothed.dir.copy(vDir);
      } else {
        // High-precision pointer/cursor stabilizing smoothing (since we point from wrist)
        // 0.06 is extremely stable, acting like a cinematic camera stabilizer mount!
        smoothed.origin.lerp(vWrist, 0.25);
        smoothed.dir.lerp(vDir, 0.06).normalize();
      }

      // --- HTML INTERACTION (RAYCASTING TO DOM) ---
      // Dynamically query the focused browser's dynamic depth to eliminate parallax drift
      let targetZ = -4;
      if (focusedBrowserId) {
        const browserObj = state.scene.getObjectByName(`browser-${focusedBrowserId}`);
        if (browserObj) {
          targetZ = browserObj.position.z;
        }
      }
      
      const uiPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -targetZ);
      const ray = new THREE.Ray(smoothed.origin, smoothed.dir);
      const intersectPoint = new THREE.Vector3();

      let hasIntersection = false;

      if (ray.intersectPlane(uiPlane, intersectPoint)) {
        hasIntersection = true;

        // Perform velocity-adaptive cursor smoothing on the 3D UI plane
        const smoothedCursor = smoothedCursorPosRef.current[h];
        if (smoothedCursor.lengthSq() === 0 || smoothedCursor.distanceTo(intersectPoint) > 1.8) {
          smoothedCursor.copy(intersectPoint);
        } else {
          const dist = smoothedCursor.distanceTo(intersectPoint);

          let alpha = 0.28; // Default fast sweep tracking speed

          if (dist < 0.04) {
            // Stationary/fine-tuning zone (within 40mm / 4cm)
            // Cubic scaling makes tiny wiggles get almost 0 tracking speed (absolutely locked!)
            // while deliberate micro-adjustments feel smooth and responsive.
            const normalizedDist = dist / 0.04;
            alpha = 0.0008 + 0.23 * Math.pow(normalizedDist, 3);
          } else {
            // Deliberate movement / fast sweep
            alpha = 0.28;
          }

          smoothedCursor.lerp(intersectPoint, alpha);
        }

        // Project the ultra-stabilized 3D collision point to NDC coordinates
        const ndcPoint = smoothedCursor.clone().project(state.camera);

        // Convert NDC (-1 to 1) to 2D screen pixels
        const domX = (ndcPoint.x + 1) / 2 * window.innerWidth;
        const domY = -(ndcPoint.y - 1) / 2 * window.innerHeight;

        // Find the topmost actual HTML DOM element at this specific screen coordinate
        const element = document.elementFromPoint(domX, domY);

        // Handle Hover States (Trigger CSS :hover effects via JS and satisfy React's synthetic event listeners)
        const hoverd = hoveredElementRef.current[h];
        if (element !== hoverd) {
          if (hoverd) {
            hoverd.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, clientX: domX, clientY: domY }));
            hoverd.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false, clientX: domX, clientY: domY }));
          }
          if (element) {
            element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX: domX, clientY: domY }));
            element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false, clientX: domX, clientY: domY }));
            element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: domX, clientY: domY }));
          }
          hoveredElementRef.current[h] = element;
        } else if (element) {
          element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: domX, clientY: domY }));
        }

        // Handle Click Event (Complete Mouse click lifecycle: mousedown -> mouseup -> click)
        if (isPinching && !isPinchingRef.current[h]) {
          if (element) {
            element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: domX, clientY: domY }));
          }
        } else if (!isPinching && isPinchingRef.current[h]) {
          if (element) {
            element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: domX, clientY: domY }));
            element.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: domX, clientY: domY }));
          }
        }

        // Position the Spatial Cursor exactly on the UI plane (offset slightly to avoid z-fighting)
        tempObject.position.copy(smoothedCursor);
        tempObject.position.z += 0.02; // Bring slightly forward of the UI plane

        // Premium touch: shrink the cursor slightly when pinching (tactile feedback)
        const scaleSize = isPinching ? 0.6 : 1.0;
        tempObject.scale.set(scaleSize, scaleSize, scaleSize);
        tempObject.rotation.set(0, 0, 0);
        tempObject.updateMatrix();

        cursorMeshRef.current.setMatrixAt(h, tempObject.matrix);

        // Visually indicate pinch by turning the cursor red
        tempColor.setHex(isPinching ? 0xff0000 : 0xffffff);
        cursorMeshRef.current.setColorAt(h, tempColor);

        // Update the global sibling DOM cursor (rendered outside canvas to bypass any iframe/CSS 3D transform occlusion)
        const cursorDom = document.getElementById(`spatial-cursor-${h}`);
        if (cursorDom) {
          cursorDom.style.transform = `translate3d(${domX}px, ${domY}px, 0) translate(-50%, -50%) scale(${scaleSize})`;
          cursorDom.style.opacity = '1';
          cursorDom.style.borderColor = isPinching ? '#38bdf8' : '#ffffff';
          cursorDom.style.backgroundColor = isPinching ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.15)';
        }
      } else {
        // Ray missed the plane entirely, clear hover
        const hoverd = hoveredElementRef.current[h];
        if (hoverd) {
          hoverd.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
          hoverd.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false }));
          hoveredElementRef.current[h] = null;
        }

        // Hide the cursor by scaling to 0
        tempObject.position.set(0, 0, 0);
        tempObject.scale.set(0, 0, 0);
        tempObject.updateMatrix();
        cursorMeshRef.current.setMatrixAt(h, tempObject.matrix);

        // Hide the global DOM cursor
        const cursorDom = document.getElementById(`spatial-cursor-${h}`);
        if (cursorDom) cursorDom.style.opacity = '0';
      }

      // Update previous pinch state for this hand to prevent double-clicking
      isPinchingRef.current[h] = isPinching;
    }

    jointMeshRef.current.instanceMatrix.needsUpdate = true;
    boneMeshRef.current.instanceMatrix.needsUpdate = true;
    cursorMeshRef.current.instanceMatrix.needsUpdate = true;

    // Crucial: tell ThreeJS to update the instance colors we set
    if (cursorMeshRef.current.instanceColor) {
      cursorMeshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={jointMeshRef} args={[undefined, undefined, JOINT_COUNT * MAX_HANDS]} frustumCulled={false}>
        <sphereGeometry args={[0.032, 20, 20]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.45}
          roughness={0.1}
          metalness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </instancedMesh>

      <instancedMesh ref={boneMeshRef} args={[undefined, undefined, BONE_COUNT * MAX_HANDS]} frustumCulled={false}>
        <cylinderGeometry args={[0.018, 0.018, 1, 10]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          roughness={0.1}
          metalness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </instancedMesh>

      {/* The Spatial Cursor (Vision Pro style ring) */}
      <instancedMesh ref={cursorMeshRef} args={[undefined, undefined, MAX_HANDS]} frustumCulled={false}>
        <ringGeometry args={[0.015, 0.025, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </>
  );
}