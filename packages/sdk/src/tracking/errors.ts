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

type ErrorBuckets = Record<string, ErrorEntry[]>;

type DebugContext = {
  errors: ErrorBuckets;
};

export type ErrorBuffer = {
  debugContext: DebugContext;
  clientContext: ClientContext;
};

// Session Buffer

const MAX_ERRORS_LIMIT = 60;

export const errorsBuffer: ErrorBuffer = {
  debugContext: {
    errors: {},
  },
  clientContext: getClientContext(),
};

//Context Builders

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

// Error Grouping Helpers

function getBucketKey(type: string): string {
  switch (type) {
    case "TypeError":
      return "typeErrors";
    case "ReferenceError":
      return "referenceErrors";
    case "SyntaxError":
      return "syntaxErrors";
    case "RangeError":
      return "rangeErrors";
    case "URIError":
      return "uriErrors";
    case "AbortError":
      return "abortErrors";
    default:
      return "generalErrors";
  }
}

function getTotalErrors(): number {
  return Object.values(errorsBuffer.debugContext.errors).reduce(
    (total, arr) => total + arr.length,
    0,
  );
}

function pushError(entry: ErrorEntry) {
  if (getTotalErrors() >= MAX_ERRORS_LIMIT) return;

  const bucketKey = getBucketKey(entry.type);

  if (!errorsBuffer.debugContext.errors[bucketKey]) {
    errorsBuffer.debugContext.errors[bucketKey] = [];
  }

  errorsBuffer.debugContext.errors[bucketKey].push(entry);
}

// main error capture
export function errorCapture() {
  window.addEventListener("error", (event) => {
    if (event.message === "Script error.") return;

    const errorObj =
      event.error instanceof Error ? event.error : new Error(event.message);

    const entry = buildErrorEntry(errorObj, event);
    pushError(entry);

    console.log("errorsBuffer", errorsBuffer);
  });

  window.addEventListener("unhandledrejection", (event) => {
    const errorObj = normalizeReason(event.reason);

    if (errorObj.name === "AbortError") return;

    const entry = buildErrorEntry(errorObj, event);
    pushError(entry);

    console.log("errorsBuffer", errorsBuffer);
  });
}
