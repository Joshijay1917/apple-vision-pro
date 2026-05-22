'use client';

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const requestVRSensors = async (): Promise<boolean> => {
  try {
    // Check if the current browser requires explicit runtime permissions (iOS 13+)
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      return permission === "granted";
    }
    
    // Standard Android/Desktop browsers grant this implicitly
    return true; 
  } catch (err) {
    console.error("DeviceOrientation permission denied or blocked:", err);
    return false;
  }
};

export function DeviceOrientationController() {
  const { camera } = useThree();
  const rotationRef = useRef({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // Convert degrees to radians
      rotationRef.current = {
        alpha: e.alpha ? THREE.MathUtils.degToRad(e.alpha) : 0,
        beta: e.beta ? THREE.MathUtils.degToRad(e.beta) : 0,
        gamma: e.gamma ? THREE.MathUtils.degToRad(e.gamma) : 0,
      };
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const getScreenOrientation = (): number => {
    if (typeof window === "undefined") return 0;
    if (window.screen?.orientation?.angle !== undefined) {
      return THREE.MathUtils.degToRad(window.screen.orientation.angle);
    }
    if ('orientation' in window) {
      return THREE.MathUtils.degToRad((window as any).orientation as number || 0);
    }
    return 0;
  };

  useFrame(() => {
    const { alpha, beta, gamma } = rotationRef.current;
    
    // 1. Create euler angles. The device orientation sensor convention uses YXZ order.
    // beta (X), alpha (Y), -gamma (Z)
    const deviceEuler = new THREE.Euler(beta, alpha, -gamma, "YXZ");
    
    // 2. Create quaternion from euler representation
    const deviceQuaternion = new THREE.Quaternion().setFromEuler(deviceEuler);
    
    // 3. Compensate for the screen orientation (portrait vs landscape tilt angle)
    const screenAngle = getScreenOrientation();
    const screenQuaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      -screenAngle
    );
    
    // 4. Align with world-space camera (rotate -90 degrees on X axis so camera looks forward instead of up)
    const alignQuaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      -Math.PI / 2
    );
    
    // Combine transformations
    const targetQuaternion = new THREE.Quaternion()
      .copy(alignQuaternion)
      .multiply(deviceQuaternion)
      .multiply(screenQuaternion);

    // Smooth camera slerp for a ultra-premium visual transition
    camera.quaternion.slerp(targetQuaternion, 0.15);
  });

  return null;
}
