import { CorsOptions } from "cors";
import { FRONTEND_URL } from "@repo/common/config";

// cors config
export const corsConfig: CorsOptions = {
  // origin: FRONTEND_URL,
  origin: [FRONTEND_URL, "http://localhost:3001"], // "http://localhost:3001" is my dummy user website ( using serve )
  credentials: true,
};
