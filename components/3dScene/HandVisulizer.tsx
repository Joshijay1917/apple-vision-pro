'use client';

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useHandTracking } from "../../context/HandTrackingContext";

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

  // Interaction State
  const isPinchingRef = useRef<boolean[]>([false, false]);
  const hoveredElementRef = useRef<(Element | null)[]>([null, null]);

  useFrame((state) => {
    const hands = handsRef.current;

    if (!jointMeshRef.current || !boneMeshRef.current || !cursorMeshRef.current) return;

    if (!hands || hands.length === 0) {
      jointMeshRef.current.count = 0;
      boneMeshRef.current.count = 0;
      cursorMeshRef.current.count = 0;

      // Reset smoothing data when hands are lost
      smoothingRef.current[0].origin.set(0, 0, 0);
      smoothingRef.current[1].origin.set(0, 0, 0);

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

      if (!keypoints3D || !keypoints2D) continue;

      // Calculate the hand's center in screen space (-0.5 to 0.5)
      // Mirror the X because webcams are mirrored
      const screenX = (keypoints2D[0].x / 640) - 0.5;
      const screenY = (keypoints2D[0].y / 480) - 0.5;

      // Map screen space to 3D world space at the current offsetZ
      const worldOffsetX = -screenX * viewWidth * 2; // Inverted for mirror
      const worldOffsetY = -screenY * viewHeight * 2;

      // 1. Update Joints
      for (let i = 0; i < JOINT_COUNT; i++) {
        const kp = keypoints3D[i];
        const idx = h * JOINT_COUNT + i;

        // Combine the local 3D keypoint position (flipped for mirror) with the hand's world offset
        tempObject.position.set(
          -kp.x * scale + worldOffsetX,
          -kp.y * scale + worldOffsetY + offsetY,
          kp.z * scale + offsetZ
        );

        tempObject.scale.set(1, 1, 1);
        tempObject.rotation.set(0, 0, 0);
        tempObject.updateMatrix();
        jointMeshRef.current.setMatrixAt(idx, tempObject.matrix);
      }

      // 2. Update Bones
      for (let j = 0; j < BONE_COUNT; j++) {
        const [startIdx, endIdx] = BONE_PAIRS[j];
        const startKP = keypoints3D[startIdx];
        const endKP = keypoints3D[endIdx];

        vStart.set(
          -startKP.x * scale + worldOffsetX,
          -startKP.y * scale + worldOffsetY + offsetY,
          startKP.z * scale + offsetZ
        );
        vEnd.set(
          -endKP.x * scale + worldOffsetX,
          -endKP.y * scale + worldOffsetY + offsetY,
          endKP.z * scale + offsetZ
        );

        const dist = vStart.distanceTo(vEnd);
        if (dist < 0.0001) continue;

        vDir.subVectors(vEnd, vStart).normalize();

        tempObject.position.copy(vStart).add(vEnd).multiplyScalar(0.5);
        tempObject.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vDir);
        tempObject.scale.set(1, dist, 1);
        tempObject.updateMatrix();
        boneMeshRef.current.setMatrixAt(h * BONE_COUNT + j, tempObject.matrix);
      }

      // 3. Update Laser Pointer (White Rod) with Anti-Jitter Smoothing
      const thumbTipKP = keypoints3D[4]; // Thumb Tip
      const indexPipKP = keypoints3D[6]; // Index PIP
      const indexTipKP = keypoints3D[8]; // Index Tip
      const thumbPipKP = keypoints3D[2]; // Thumb PIP

      vThumbTip.set(
        -thumbTipKP.x * scale + worldOffsetX,
        -thumbTipKP.y * scale + worldOffsetY + offsetY,
        thumbTipKP.z * scale + offsetZ
      );
      vThumbPip.set(
        -thumbPipKP.x * scale + worldOffsetX,
        -thumbPipKP.y * scale + worldOffsetY + offsetY,
        thumbPipKP.z * scale + offsetZ
      );
      vIndexPip.set(
        -indexPipKP.x * scale + worldOffsetX,
        -indexPipKP.y * scale + worldOffsetY + offsetY,
        indexPipKP.z * scale + offsetZ
      );
      vIndexTip.set(
        -indexTipKP.x * scale + worldOffsetX,
        -indexTipKP.y * scale + worldOffsetY + offsetY,
        indexTipKP.z * scale + offsetZ
      );

      // --- PINCH DETECTION ---
      // Measure the physical 3D distance between the thumb and index finger tips
      const pinchDistance = vThumbTip.distanceTo(vIndexTip);
      const isPinching = pinchDistance < 0.25; // The threshold for a "click"
      const midPip = new THREE.Vector3();
      const midTip = new THREE.Vector3();
      midPip.addVectors(vThumbPip, vIndexPip).multiplyScalar(0.5);
      midTip.addVectors(vIndexTip, vThumbTip).multiplyScalar(0.5);

      // Raw Target Data
      vMidpoint.addVectors(vThumbTip, vIndexTip).multiplyScalar(0.5);
      vDir.subVectors(midTip, midPip).normalize();

      const smoothed = smoothingRef.current[h];

      // If hand just appeared or teleported (tracking glitch), snap immediately
      if (smoothed.origin.lengthSq() === 0 || smoothed.origin.distanceTo(vMidpoint) > 2.0) {
        smoothed.origin.copy(vMidpoint);
        smoothed.dir.copy(vDir);
      } else {
        // EMA Smoothing logic
        // 0.2 means 20% new position, 80% old position (lower is smoother but laggier)
        smoothed.origin.lerp(vMidpoint, 0.3);

        // Direction gets heavier smoothing because tiny rotational jitters are massively amplified over distance
        smoothed.dir.lerp(vDir, 0.1).normalize();
      }

      // --- HTML INTERACTION (RAYCASTING TO DOM) ---
      // Define the virtual UI plane (z = -4, facing +z) to match the <Html> component in Scene.tsx
      const uiPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 4);
      const ray = new THREE.Ray(smoothed.origin, smoothed.dir);
      const intersectPoint = new THREE.Vector3();

      let hasIntersection = false;

      if (ray.intersectPlane(uiPlane, intersectPoint)) {
        hasIntersection = true;

        // Project 3D collision point to Normalized Device Coordinates (NDC) using the camera
        // Clone first to prevent mutating intersectPoint which we need for 3D cursor positioning
        const ndcPoint = intersectPoint.clone().project(state.camera);

        // Convert NDC (-1 to 1) to 2D screen pixels
        const domX = (ndcPoint.x + 1) / 2 * window.innerWidth;
        const domY = -(ndcPoint.y - 1) / 2 * window.innerHeight;

        // Find the topmost actual HTML DOM element at this specific screen coordinate
        const element = document.elementFromPoint(domX, domY);

        // Handle Hover States (Trigger CSS :hover effects via JS and satisfy React's synthetic event listeners)
        const hoverd = hoveredElementRef.current[h];
        if (element !== hoverd) {
          if (hoverd) {
            // React uses mouseout/mouseover to generate synthetic onMouseEnter/onMouseLeave
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
          // Continuously dispatch mousemove while hovering to keep coordinate tracking updated
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
        tempObject.position.copy(intersectPoint);
        tempObject.position.z += 0.02; // Bring slightly forward of z = -4

        // Premium touch: shrink the cursor slightly when pinching (tactile feedback)
        const scaleSize = isPinching ? 0.6 : 1.0;
        tempObject.scale.set(scaleSize, scaleSize, scaleSize);
        tempObject.rotation.set(0, 0, 0);
        tempObject.updateMatrix();

        cursorMeshRef.current.setMatrixAt(h, tempObject.matrix);

        // Visually indicate pinch by turning the cursor red
        tempColor.setHex(isPinching ? 0xff0000 : 0xffffff);
        cursorMeshRef.current.setColorAt(h, tempColor);
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
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </>
  );
}