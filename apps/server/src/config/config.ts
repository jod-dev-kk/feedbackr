import { CorsOptions } from "cors";

// cors config
export const corsConfig: CorsOptions = {
  // origin: FRONTEND_URL,
  // origin: [FRONTEND_URL, "http://localhost:3001", "http://localhost:5174"], // "http://localhost:3001" is my dummy user website ( using serve )
  origin: "*",
  credentials: true,
};
