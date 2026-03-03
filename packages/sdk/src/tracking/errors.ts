import { parse, StackFrame } from "stacktrace-parser";

/* ================================
   Types
================================ */

type ClientContext = {
  networkStatus: boolean;
  userAgent: string;
  url: string;
  language: string;
  screenWidth: number;
  screenHeight: number;
};

type ErrorEntry = {
  type: string;
  message: string;
  stackTrace: StackFrame[];
  occuredAt: string;
  pageTimeMs: number;
};

type DebugContext = {
  errors: ErrorEntry[];
};

export type ErrorBuffer = {
  debugContext: DebugContext;
  clientContext: ClientContext;
};

/* ================================
   Session Buffer (Single Object)
================================ */

const MAX_ERRORS_LIMIT = 60;

export const errorsBuffer: ErrorBuffer = {
  debugContext: {
    errors: [],
  },
  clientContext: getClientContext(),
};

/* ================================
   Context Builders
================================ */

function getClientContext(): ClientContext {
  return {
    networkStatus: navigator.onLine,
    userAgent: navigator.userAgent,
    url: location.href,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
}

function buildErrorEntry(
  error: Error,
  meta: { timeStamp: number },
): ErrorEntry {
  return {
    type: error.name,
    message: error.message,
    stackTrace: parse(error.stack ?? "")
      .filter((frame) => frame.file)
      .slice(0, 5),
    occuredAt: new Date().toISOString(),
    pageTimeMs: Math.round(meta.timeStamp),
  };
}

function normalizeReason(reason: unknown): Error {
  if (reason instanceof Error) return reason;

  if (typeof reason === "string") {
    return new Error(reason);
  }

  try {
    return new Error(JSON.stringify(reason));
  } catch {
    return new Error("Unknown rejection");
  }
}

/* ================================
   Main Error Capture
================================ */

export function errorCapture() {
  window.addEventListener("error", (event) => {
    if (event.message === "Script error.") return;

    const errorObj =
      event.error instanceof Error ? event.error : new Error(event.message);

    if (errorsBuffer.debugContext.errors.length < MAX_ERRORS_LIMIT) {
      errorsBuffer.debugContext.errors.push(buildErrorEntry(errorObj, event));
    }
    console.log("errorsBuff", errorsBuffer);
  });

  window.addEventListener("unhandledrejection", (event) => {
    const errorObj = normalizeReason(event.reason);

    if (errorObj.name === "AbortError") return;

    if (errorsBuffer.debugContext.errors.length < MAX_ERRORS_LIMIT) {
      errorsBuffer.debugContext.errors.push(buildErrorEntry(errorObj, event));
    }
    console.log("errorsBuff", errorsBuffer);
  });
}
