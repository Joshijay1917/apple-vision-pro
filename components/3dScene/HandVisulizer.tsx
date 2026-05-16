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
  
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  
  const vStart = useMemo(() => new THREE.Vector3(), []);
  const vEnd = useMemo(() => new THREE.Vector3(), []);
  const vDir = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const hands = handsRef.current;
    
    if (!jointMeshRef.current || !boneMeshRef.current) return;

    if (!hands || hands.length === 0) {
      jointMeshRef.current.count = 0;
      boneMeshRef.current.count = 0;
      return;
    }

    jointMeshRef.current.count = hands.length * JOINT_COUNT;
    boneMeshRef.current.count = hands.length * BONE_COUNT;

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
        
        // Combine the local 3D keypoint position with the hand's world offset
        tempObject.position.set(
            kp.x * scale + worldOffsetX, 
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
            startKP.x * scale + worldOffsetX, 
            -startKP.y * scale + worldOffsetY + offsetY, 
            startKP.z * scale + offsetZ
        );
        vEnd.set(
            endKP.x * scale + worldOffsetX, 
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
    }

    jointMeshRef.current.instanceMatrix.needsUpdate = true;
    boneMeshRef.current.instanceMatrix.needsUpdate = true;
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
    </>
  );
}