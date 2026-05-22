'use client';

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export function StereoRenderer() {
  const { gl, scene, camera, size } = useThree();

  // Create an internal persistent StereoCamera instance
  const stereoCam = useMemo(() => {
    const stereo = new THREE.StereoCamera();
    stereo.aspect = 0.5; // Each eye gets exactly half the screen aspect ratio
    stereo.eyeSep = 0.064; // Default Interpupillary Distance (IPD)
    return stereo;
  }, []);

  useEffect(() => {
    gl.setScissorTest(true);
    return () => gl.setScissorTest(false);
  }, [gl]);

  useFrame(() => {
    gl.clear();

    // 1. Update the stereo camera's projection matrices based on the main camera
    camera.updateMatrixWorld();
    stereoCam.update(camera as THREE.PerspectiveCamera);

    // Get specific dimensions for splitting the screen horizontally down the middle
    const halfWidth = size.width / 2;

    // 2. RENDER THE LEFT EYE
    gl.setViewport(0, 0, halfWidth, size.height);
    gl.setScissor(0, 0, halfWidth, size.height);
    gl.render(scene, stereoCam.cameraL);

    // 3. RENDER THE RIGHT EYE
    gl.setViewport(halfWidth, 0, halfWidth, size.height);
    gl.setScissor(halfWidth, 0, halfWidth, size.height);
    gl.render(scene, stereoCam.cameraR);
  }, 1); // Priority 1 intercept ensures this overrides the default single-pass render loop

  return null;
}
