import { handlePostMessage } from "@/utils/postMessage.utils.ts";
import { useCallback, useState } from "react";

export const useGetSubmitDetails = () => {
  const [isFetching, setIsFetching] = useState(false);

  const getData = useCallback(async () => {
    setIsFetching(true);

    return new Promise<{
      errors: {
        debugContext: Record<string, any>;
        clientContext: Record<string, any>;
      };
      url: string;
    }>((resolve) => {
      const timeoutId = setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        setIsFetching(false);
        resolve({
          url: window.location.href,
          errors: { clientContext: {}, debugContext: {} },
        });
      }, 10000);

      const handleMessage = (event: MessageEvent) => {
        if (event?.data?.type === "FEEDBACK_SUBMIT_RESPONSE") {
          clearTimeout(timeoutId);
          window.removeEventListener("message", handleMessage);
          setIsFetching(false);
          resolve(event?.data?.data);
        }
      };

      window.addEventListener("message", handleMessage);
      handlePostMessage("FEEDBACK_SUBMIT_DETAILS");
    });
  }, []);

  return { getData, isFetching };
};
