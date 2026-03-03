import { errorCapture } from "../tracking/errors";
import { destroyListener, registerListener } from "./events";
import { handleSubmitDetails, handleTakeScreenshot } from "./handlers";
import { createWidgetIframe } from "./iframe";

export function injectWidget(clientId: string) {
  if (document.getElementById("__feedback_iframe")) return;
  const { styles, iframe } = createWidgetIframe(clientId);

  // injecting the widget
  document.head.appendChild(styles);
  document.body.appendChild(iframe);

  // Listen to widget events

  registerListener("FEEDBACK_WIDGET_OPEN", () => {
    console.log("bridge working on OPEN state");
    iframe.classList.remove("closeWidgetFrame");
    iframe.classList.add("openWidgetFrame");
  });
  registerListener("FEEDBACK_WIDGET_CLOSE", () => {
    console.log("bridge working on Close state");
    iframe.classList.remove("openWidgetFrame");
    iframe.classList.add("closeWidgetFrame");
  });
  registerListener("TAKE_SCREENSHOT", handleTakeScreenshot);

  errorCapture();

  registerListener("FEEDBACK_SUBMIT_DETAILS", handleSubmitDetails);
}

export function destroyWidget() {
  destroyListener("FEEDBACK_WIDGET_OPEN");
  destroyListener("FEEDBACK_WIDGET_CLOSE");

  document.getElementById("__feedback_iframe")?.remove();
}
