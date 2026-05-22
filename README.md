# 🌌 Spatial Computing Multitasking OS & 3D Browser

Welcome to the **Spatial Computing Multitasking OS**! This is a state-of-the-art 3D immersive desktop simulation built using **Next.js**, **React Three Fiber (Three.js)**, and **MediaPipe/TensorFlow.js AI Hand-Tracking**. 

Users can control multiple glassmorphic browser windows in 3D space concurrently using both a **physical mouse/trackpad** (with immersive 360° VR look controls) and **virtual hand-tracking pinch gestures** via their standard laptop webcam!

---

## 🌟 Core Features

### 1. Immersive Multitasking Desktop OS
*   **Dynamic Staggered Spawning**: Spawn multiple independent floating application windows concurrently in a 3D coordinate scene with staggered spacing vectors to prevent visual occlusion or z-fighting.
*   **Window Focus State Manager**: Focus active panels to highlight glowing border rings, dynamic cursors, and scale bounds, while unfocused windows naturally fade in opacity.
*   **Dual-Hand Gesture Scaling**: Pinch both hands simultaneously and stretch or compress to dynamically scale window sizes with premium organic spring dampening effects.
*   **Exclusive Bottom Drag Indicator Handles**: Drag windows natively via a sleek bottom capsule bar. The handle features an expanded invisible grab boundary (**580px x 64px**) with **Pointer-Events Isolation** (the capsule is non-blocking, routing raycasts directly to parent listeners) to make virtual pointer grabbing easy and secure.

### 2. AI Hand Tracking & Gesture Recognition
*   **Real-time skeletal tracking**: Leverages MediaPipe and TensorFlow.js running 100% locally on the client's GPU via WebGL to calculate a 21-joint skeleton model at 60 FPS.
*   **Cinematic Jitter Stabilization**: Implements high-performance **Exponential Moving Average (EMA)** smoothing alongside **velocity-adaptive scaling algorithms** to achieve dead-zone reticle stability for fine-tuning.
*   **Pinch-Click Simulation**: Measures real-time thumb-to-index Euclidean distance. Snapping fingers together automatically fires simulated standard `mousedown` events on targeted elements, while opening fires `mouseup` / `click`.
*   **Ergonomic Ray Angle Bias**: Features a calibrated downward pointing offset (`vDir.y -= 0.22`) that translates pointing gestures comfortably to the lower half of the screen without raising your arms or causing physical fatigue.
*   **Anti-Occlusion DOM Cursors**: Injects high-performance sibling cursor nodes directly into `document.body` via React Portals, completely bypassing Drei/HTML 3D transformed containers to prevent any visual occlusion.

### 3. Integrated Native Applications
*   **Safari Web Browser Shell**: Includes dynamic history navigation (Back/Forward controls), glowing address input forms, and interactive start pages.
*   **Deep Space Explorer Dashboard**: A custom telemetry dashboard featuring rotating celestial nebulas, orbital sync gauges, dynamic system diagnostic grids, and active graphs—built natively with zero external network APIs.
*   **DuckDuckGo Private Search Portal**: Custom landing page and search results engine that parses queries and presents results beautifully, allowing you to load web links natively and bypass common iframe Content Security Policies (CSP).

### 4. Hybrid Immersive Controls
*   **First-Person Pointer Lock**: Clicking the empty 3D background locks the mouse cursor, allowing you to swing your view freely in a 360° environment.
*   **Secure Gesture Lock Isolation**: Automatic Pointer Lock requests verify `event.isTrusted` to filter out virtual pointer clicks, completely avoiding console warning errors or browser blocking issues.
*   **Pointer & Mouse Event Unification**: Seamlessly bridges synthetic `MouseEvent` dispatches (from simulated hands) and native trackpad `PointerEvent` triggers to share the same dragging state machine.

---

## 🛠️ File Structure

The project has been organized with strict structural separation:
```
my-app/
├── context/
│   ├── HandTrackingContext.tsx      # High-performance 21-joint tracking buffer
│   └── ApplicationContext.tsx       # OS window spawning and dynamic address handlers
├── components/
│   ├── Scene.tsx                    # WebGL Scene canvas, global portals, & camera controller
│   └── 3dScene/
│       ├── HandVisulizer.tsx        # Joint mesh renders, stabilizers, & DOM click dispatchers
│       └── Applications/
│           └── Safari/
│               ├── SafariBrowser.tsx     # Window transformations, drag loops, & navbar
│               ├── SafariHome.tsx        # Start page & preconfigured bookmarks
│               ├── DeepSpaceExplorer.tsx # Native custom cosmic mock telemetry app
│               └── DuckDuckGoSearch.tsx  # Dynamic search index bypassing iframe restrictions
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** v18 or higher
*   **npm**, **yarn**, **pnpm**, or **bun**
*   A device with a standard webcam (for AI Hand Tracking)

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd my-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your web browser. 

---

## 💻 Tech Stack & Architecture

*   **Framework**: Next.js 16 (App Router)
*   **3D Render Pipeline**: Three.js, React Three Fiber (R3F), and `@react-three/drei`
*   **AI Engine**: TensorFlow.js, MediaPipe Hands Model
*   **Styling**: TailwindCSS & Vanilla CSS (supporting rich visionOS glassmorphism tokens)
*   **Icons**: Lucide React

---

## ☁️ Deployment & Scalability

This application is fully optimized for **Vercel** deployment:
*   **Infinite Scalability**: Since the heavy AI neural network computing (MediaPipe) and WebGL 3D graphics rendering run **100% locally on the client's device (GPU/CPU)**, Vercel only serves static JS/CSS files. This keeps your server usage extremely low and costs $0 to host even with millions of concurrent visitors!
*   **Next.js Server Optimization**: Static assets are distributed globally on Vercel's Edge CDN network for instant startup loading times.
