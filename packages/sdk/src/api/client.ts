import { getCache, setCache } from "../core/cache";

export interface ValidateClientResponse {
  data: {
    valid: boolean;
  };
  message?: string;
}

const BACKEND_URL = "http://localhost:8001";
export async function validateClientId(
  clientId: string,
): Promise<ValidateClientResponse> {
  if (!clientId) {
    throw new Error("clientId is required");
  }

  const cached = getCache(clientId);
  if (cached) {
    return {
      data: { valid: true },
      message: "validated",
    };
  }

  try {
    const url = new URL(
      `${BACKEND_URL}/api/domain/validateClientId`,
      window.location.origin,
    ); // adjust backend URL
    url.searchParams.append("clientId", clientId);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Validation failed with status ${response.status}`);
    }

    setCache(clientId);

    const data: ValidateClientResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error validating clientId:", error);
    throw error;
  }
}
