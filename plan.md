# Implementation Plan: WebRTC Remote Camera Tracking

This plan outlines the steps to allow a mobile phone to act as a remote camera source for the desktop hand-tracking system using WebRTC (PeerJS).

## 1. Objectives
- Enable high-performance hand tracking on desktop using a mobile phone's back camera.
- Maintain "Butter Smooth" performance by processing frames on the desktop GPU.
- Seamless "Hot-Swap" between local webcam and remote mobile camera.

## 2. Technical Stack
- **WebRTC Library**: `peerjs` (for simplified P2P signaling and streaming).
- **Mobile Access**: A dedicated `/mobile` route in the Next.js app.
- **AI Processing**: Existing MediaPipe WASM runtime on the desktop.

## 3. Proposed Changes

### A. Infrastructure
- [ ] Install `peerjs` and `@types/peerjs`.
- [ ] Add `qrcode.react` to generate connection codes for easy mobile pairing.

### B. Mobile Sender Page (`app/mobile/page.tsx`)
- [ ] Implement camera capture for `facingMode: 'environment'`.
- [ ] Add PeerJS client to "Call" the desktop ID.
- [ ] UI: Simple "Tap to Connect" interface with status indicators.

### C. Global Context Integration (`context/HandTrackingContext.tsx`)
- [ ] Initialize PeerJS server on desktop mount.
- [ ] Add `remoteStream` state and `isRemote` flag.
- [ ] Update `detectLoop` to switch source to `remoteStream` if available.
- [ ] Add logic to handle incoming WebRTC calls.

### D. UI/UX Refinement (`components/Scene.tsx`)
- [ ] Add "Connect Mobile" button to the Welcome Panel.
- [ ] Display a QR code that encodes the Desktop Peer ID.
- [ ] Show connectivity status (e.g., "Signal Strength", "Latency").

## 4. Workflow
1. **Desktop**: Generates a unique Peer ID (e.g., `vision-1234`).
2. **User**: Scans QR code on their phone.
3. **Mobile**: Opens `/mobile?peerId=vision-1234` and requests back camera.
4. **Connection**: Mobile initiates a WebRTC "Call" to the desktop.
5. **Streaming**: Desktop accepts call, receives `MediaStream`, and feeds it into the Hand Detection AI.

## 5. Verification Plan
- [ ] Test local webcam fallback if mobile disconnects.
- [ ] Verify that hand orientation (mirroring) is handled correctly for back cameras (which are usually NOT mirrored).
- [ ] Measure latency to ensure real-time responsiveness.
