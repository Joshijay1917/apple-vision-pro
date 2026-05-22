import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import LayoutWrapper from "@/components/LayoutWrapper";
import { HandTrackingProvider } from "@/context/HandTrackingContext";
import { SceneProvider } from "@/context/SceneContext";
import { ApplicationProvider } from "@/context/ApplicationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "visionOS Spatial OS - Immersive Web VR & Hand Tracking",
  description: "An immersive visionOS-style spatial computing multitasking operating system in the browser, featuring stereoscopic Side-by-Side Cardboard VR mode and real-time AI back-camera hand pose tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        {/* Load AI Libraries via CDN to avoid bundler export issues */}
        <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection" strategy="beforeInteractive" />

        <HandTrackingProvider>
          <LayoutWrapper>
            <SceneProvider>
              <ApplicationProvider>
                {children}
              </ApplicationProvider>
            </SceneProvider>
          </LayoutWrapper>
        </HandTrackingProvider>

      </body>
    </html>
  );
}