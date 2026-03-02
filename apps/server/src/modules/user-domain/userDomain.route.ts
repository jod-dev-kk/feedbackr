import express from "express";
import { UserDomainController } from "./userDomain.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
export const UserDomainRouter = express.Router();

// this is public api , so we dont need authMiddleware here.
UserDomainRouter.post("/validateClientId", UserDomainController.verifyClientId);

// private routess
UserDomainRouter.use(authMiddleware);
UserDomainRouter.post("/", UserDomainController.createDomain);
UserDomainRouter.get("/", UserDomainController.getDomainsList);
UserDomainRouter.get("/exists", UserDomainController.checkUserHasDomain);
UserDomainRouter.get("/:domainId", UserDomainController.getDomain);
UserDomainRouter.patch("/:domainId", UserDomainController.updateDomainStatus);
UserDomainRouter.post(
  "/:domainId/regenerateKey",
  UserDomainController.regenerateClientId,
);
