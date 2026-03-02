import { env } from "@repo/common/env";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { corsConfig } from "./config/config.js";
import { auth } from "./lib/better-auth/auth.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { responseMiddleware } from "./middlewares/response.middleware.js";
import { FeedbackRouter } from "./modules/feedback/feedback.route.js";
import { UserDomainRouter } from "./modules/user-domain/userDomain.route.js";
import { domainMiddleware } from "./middlewares/domain.middleware.js";

export const app = express();

app.use(cors(corsConfig));
app.use(express.json());

app.use(responseMiddleware);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/feedback", FeedbackRouter);
app.use("/api/domain", UserDomainRouter);

app.use(errorMiddleware);
app.listen(process.env.PORT, async () => {
  console.log(`Server started successfully on PORT ${env.PORT}`);
});
