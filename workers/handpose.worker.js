// Load the AI models directly from CDNs into the worker
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection');

let detector = null;
let isInitializing = false;

// Initialize the model
async function initDetector() {
  if (isInitializing || detector) return;
  isInitializing = true;

  try {
    // Ensure WebGL is ready in the worker
    await self.tf.setBackend('webgl');
    await self.tf.ready();

    detector = await self.handPoseDetection.createDetector(
      self.handPoseDetection.SupportedModels.MediaPipeHands,
      {
        runtime: 'tfjs',
        modelType: 'lite',
        maxHands: 2,
      }
    );



    self.postMessage({ type: 'INIT_SUCCESS' });
  } catch (error) {
    self.postMessage({ type: 'ERROR', payload: error.message });
  } finally {
    isInitializing = false;
  }
}

self.onmessage = async (e) => {
  const { type, imageBitmap } = e.data;

  if (type === 'INIT') {
    initDetector();
  }

  if (type === 'DETECT' && imageBitmap) {
    if (!detector) {
      // Return early if not initialized, but don't leak the bitmap
      imageBitmap.close();
      return;
    }

    try {
      const hands = await detector.estimateHands(imageBitmap);
      self.postMessage({ type: 'RESULT', payload: hands });
    } catch (error) {
      // Ignore detection errors to avoid spamming the console
    } finally {
      // VERY IMPORTANT: Close the ImageBitmap to prevent memory leaks in the worker
      imageBitmap.close();
    }
  }
};









//     self.postMessage({ type: 'INIT_SUCCESS' });
//   } catch (error) {
//     self.postMessage({ type: 'ERROR', payload: error.message });
//   } finally {
//     isInitializing = false;
//   }
// }

// self.onmessage = async (e) => {
//   const { type, imageBitmap } = e.data;

//   if (type === 'INIT') {
//     initDetector();
//   }

//   if (type === 'DETECT' && imageBitmap) {
//     if (!detector) {
//       // Return early if not initialized, but don't leak the bitmap
//       imageBitmap.close();
//       return;
//     }

//     try {
//       const hands = await detector.estimateHands(imageBitmap);
//       self.postMessage({ type: 'RESULT', payload: hands });
//     } catch (error) {
//       // Ignore detection errors to avoid spamming the console
//     } finally {
//       // VERY IMPORTANT: Close the ImageBitmap to prevent memory leaks in the worker
//       imageBitmap.close();
//     }
//   }
// };
