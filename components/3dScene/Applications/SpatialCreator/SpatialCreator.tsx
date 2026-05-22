'use client';

import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useHandTracking } from "@/context/HandTrackingContext";

interface SpatialCreatorProps {
  selectedPrimitive: "cube" | "sphere" | "cylinder";
  openPanel: string;
}

export default function SpatialCreator({ selectedPrimitive, openPanel }: SpatialCreatorProps) {
  const { handsRef } = useHandTracking();
  const meshRef = useRef<THREE.Mesh>(null);

  // Track creation state and object transformation
  const [isCreating, setIsCreating] = useState(false);
  const [objectTransform, setObjectTransform] = useState<{
    position: [number, number, number];
    scale: [number, number, number];
  } | null>(null);

  // Replicating HandVisualizer's coordinate mapping constants for flawless alignment
  const scale = 5.5;
  const offsetZ = -1.2;
  const offsetY = -0.5;
  const viewWidth = 2.0;
  const viewHeight = 1.5;

  // Threshold for pinch detection (matches HandVisualizer's click threshold of 0.25)
  const PINCH_THRESHOLD = 0.25;

  // Pre-allocated Vector3 objects to prevent garbage collection frame drops at 60 FPS
  const lThumbVec = useRef(new THREE.Vector3());
  const lIndexVec = useRef(new THREE.Vector3());
  const rThumbVec = useRef(new THREE.Vector3());
  const rIndexVec = useRef(new THREE.Vector3());

  const leftPinchCenter = useRef(new THREE.Vector3());
  const rightPinchCenter = useRef(new THREE.Vector3());
  const spawnPosition = useRef(new THREE.Vector3());

  // Reset states when the creator tool is closed/deactivated
  useEffect(() => {
    if (openPanel !== "SpatialCreator") {
      setObjectTransform(null);
      setIsCreating(false);
    }
  }, [openPanel]);

  useFrame(() => {
    if (openPanel !== "SpatialCreator") return;

    const hands = handsRef.current;
    if (!hands || hands.length < 2) {
      // If hands leave the frame, pause/lock the active transformation state
      if (isCreating) setIsCreating(false);
      return;
    }

    // Locate both Left and Right hands in the tracking buffer
    const leftHand = hands.find((h) => h.handedness === "Left" || h.handedness === "left");
    const rightHand = hands.find((h) => h.handedness === "Right" || h.handedness === "right");

    if (
      !leftHand?.keypoints3D || !rightHand?.keypoints3D || !leftHand?.keypoints || !rightHand?.keypoints ||
      leftHand.keypoints3D.length < 21 || rightHand.keypoints3D.length < 21 ||
      !leftHand.keypoints[0] || !rightHand.keypoints[0]
    ) {
      return;
    }

    // Joint index 4 is the Thumb Tip | Joint index 8 is the Index Finger Tip
    const leftThumb = leftHand.keypoints3D[4];
    const leftIndex = leftHand.keypoints3D[8];
    const rightThumb = rightHand.keypoints3D[4];
    const rightIndex = rightHand.keypoints3D[8];

    // --- LEFT HAND COORDINATE SPACE TRANSLATION ---
    const lScreenX = (leftHand.keypoints[0].x / 640) - 0.5;
    const lScreenY = (leftHand.keypoints[0].y / 480) - 0.5;
    const lWorldOffsetX = -lScreenX * viewWidth * 2;
    const lWorldOffsetY = -lScreenY * viewHeight * 2;

    lThumbVec.current.set(
      -leftThumb.x * scale + lWorldOffsetX,
      -leftThumb.y * scale + lWorldOffsetY + offsetY,
      leftThumb.z * scale + offsetZ
    );
    lIndexVec.current.set(
      -leftIndex.x * scale + lWorldOffsetX,
      -leftIndex.y * scale + lWorldOffsetY + offsetY,
      leftIndex.z * scale + offsetZ
    );

    // --- RIGHT HAND COORDINATE SPACE TRANSLATION ---
    const rScreenX = (rightHand.keypoints[0].x / 640) - 0.5;
    const rScreenY = (rightHand.keypoints[0].y / 480) - 0.5;
    const rWorldOffsetX = -rScreenX * viewWidth * 2;
    const rWorldOffsetY = -rScreenY * viewHeight * 2;

    rThumbVec.current.set(
      -rightThumb.x * scale + rWorldOffsetX,
      -rightThumb.y * scale + rWorldOffsetY + offsetY,
      rightThumb.z * scale + offsetZ
    );
    rIndexVec.current.set(
      -rightIndex.x * scale + rWorldOffsetX,
      -rightIndex.y * scale + rWorldOffsetY + offsetY,
      rightIndex.z * scale + offsetZ
    );

    // Verify if BOTH hands are performing a pinch gesture
    const isLeftPinching = lThumbVec.current.distanceTo(lIndexVec.current) < PINCH_THRESHOLD;
    const isRightPinching = rThumbVec.current.distanceTo(rIndexVec.current) < PINCH_THRESHOLD;

    if (isLeftPinching && isRightPinching) {
      setIsCreating(true);

      // 1. Calculate midpoint of each hand's pinch center
      leftPinchCenter.current.addVectors(lThumbVec.current, lIndexVec.current).multiplyScalar(0.5);
      rightPinchCenter.current.addVectors(rThumbVec.current, rIndexVec.current).multiplyScalar(0.5);

      // 2. Anchor the object exactly at the midpoint between both hands' pinch points
      spawnPosition.current.addVectors(leftPinchCenter.current, rightPinchCenter.current).multiplyScalar(0.5);

      // 3. Measure physical distance between the two hands' pinch centers to drive scale
      const currentDistance = leftPinchCenter.current.distanceTo(rightPinchCenter.current);

      // Enforce minimum limit to prevent geometry inversion
      const calculatedScale = Math.max(0.1, currentDistance);

      // 4. Update the object's transform in React state
      setObjectTransform({
        position: [spawnPosition.current.x, spawnPosition.current.y, spawnPosition.current.z],
        scale: [calculatedScale, calculatedScale, calculatedScale],
      });
    } else {
      if (isCreating) {
        // Release gesture! Lock the dimensions and position in place
        setIsCreating(false);
      }
    }
  });

  if (openPanel !== "SpatialCreator" || !objectTransform) return null;

  return (
    <mesh
      ref={meshRef}
      position={objectTransform.position}
      scale={objectTransform.scale}
    >
      {/* Premium geometries built dynamically */}
      {selectedPrimitive === "cube" && <boxGeometry args={[1, 1, 1]} />}
      {selectedPrimitive === "sphere" && <sphereGeometry args={[0.5, 32, 32]} />}
      {selectedPrimitive === "cylinder" && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}

      {/* Futuristic, glowing Glassmorphism material styled like visionOS */}
      <meshPhysicalMaterial
        color={isCreating ? "#38bdf8" : "#ffffff"} // Electric glowing blue while creating, pure crystal white when locked
        emissive={isCreating ? "#38bdf8" : "#000000"}
        emissiveIntensity={isCreating ? 0.4 : 0.0}
        transmission={0.65}
        opacity={0.85}
        transparent={true}
        roughness={0.12}
        metalness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        thickness={0.65}
      />
    </mesh>
  );
}
