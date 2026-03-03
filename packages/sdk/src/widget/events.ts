export const FEEDBACK_EVENT = [
  "FEEDBACK_WIDGET_OPEN",
  "FEEDBACK_WIDGET_CLOSE",
  "TAKE_SCREENSHOT",
  "FEEDBACK_SUBMIT_DETAILS",
] as const;

export const SDK_EVENTS = [
  "SCREENSHOT_SUCCESS",
  "SCREENSHOT_ERROR",
  "FEEDBACK_SUBMIT_RESPONSE",
] as const;

type TFeedbackEvent = (typeof FEEDBACK_EVENT)[number];
export type TSdkEvent = (typeof SDK_EVENTS)[number];

let registeredEvents = new Map<
  TFeedbackEvent,
  (this: Window, ev: MessageEvent<any>) => any
>();

export function registerListener(
  event: TFeedbackEvent,
  onMessage: (data: any) => void,
) {
  if (registeredEvents.has(event)) return;

  const handler = (e: MessageEvent) => {
    if (e.origin !== "http://localhost:5174") return;
    if (e.data?.type === event) {
      onMessage(e.data);
      return;
    }
  };

  registeredEvents.set(event, handler);

  window.addEventListener("message", handler);
}

export function destroyListener(event: TFeedbackEvent) {
  const handler = registeredEvents.get(event);
  if (!handler) return;
  window.removeEventListener("message", handler);

  registeredEvents.delete(event);
}
