export const MESSAGE_EVENT = [
  "FEEDBACK_WIDGET_OPEN",
  "FEEDBACK_WIDGET_CLOSE",
  "TAKE_SCREENSHOT",
  "FEEDBACK_SUBMIT_DETAILS",
] as const;

type TMessageType = (typeof MESSAGE_EVENT)[number];

export const handlePostMessage = (type: TMessageType, data?: any) => {
  const targetOrigin = "http://localhost:3001";
  window.parent.postMessage(
    { type, ...(data !== undefined && { data }) },
    targetOrigin,
  );
};
