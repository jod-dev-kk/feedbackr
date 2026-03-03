import { useGetSubmitDetails } from "@/hooks/useGetSubmitDetails.ts";
import { TWidgetFormPayload } from "@repo/common/schemas";

export async function submitFeedback(
  data: TWidgetFormPayload & {
    errors: {
      debugContext: Record<string, any>;
      clientContext: Record<string, any>;
    };
    url: string;
  },
) {
  console.log(data?.errors, data?.url);
  const searchParams = new URLSearchParams(window.location.search);
  const clientId = searchParams.get("clientId");

  const formData = new FormData();

  if (data.image) {
    formData.append("images", data.image);
  }

  formData.append("email", data.email);
  formData.append("message", data.message || "");

  //change with pareant url, its of iframe currently
  formData.append("url", data?.url);
  formData.append("clientContext", JSON.stringify(data?.errors?.clientContext));
  formData.append("debugContext", JSON.stringify(data?.errors?.debugContext));

  const response = await fetch("http://localhost:8001/api/feedback", {
    method: "POST",
    headers: {
      "x-client-id": clientId || "",
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to send feedback");
  }

  return response.json();
}
