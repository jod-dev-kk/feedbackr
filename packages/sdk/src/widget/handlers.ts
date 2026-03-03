import { domToBlob } from "modern-screenshot";
import { TSdkEvent } from "./events";
import { iframeId } from "./iframe";
import { errorsBuffer } from "../tracking/errors";

export const sendToWidget = (type: TSdkEvent, data?: any) => {
  const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
  if (!iframe || !iframe?.contentWindow) {
    console.warn("Feedback SDK: Iframe not found or not ready.");
    return;
  }
  iframe.contentWindow.postMessage({ type, data }, "http://localhost:5174");
};

export const handleTakeScreenshot = async () => {
  try {
    const blob = await domToBlob(document.documentElement, {
      filter: (node) => (node as HTMLElement)?.id !== iframeId,
      scale: window.devicePixelRatio || 1,
      fetch: { bypassingCache: true },
    });

    if (!blob) throw new Error("Capture failed");

    const reader = new FileReader();
    reader.onloadend = () => {
      sendToWidget("SCREENSHOT_SUCCESS", reader.result);
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("SDK Screenshot Error:", error);
    sendToWidget("SCREENSHOT_ERROR");
  }
};

export const handleSubmitDetails = () => {
  const data = { errors: errorsBuffer, url: window.location.href };
  sendToWidget("FEEDBACK_SUBMIT_RESPONSE", data);
};
