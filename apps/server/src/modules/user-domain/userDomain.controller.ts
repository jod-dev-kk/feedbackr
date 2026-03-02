import { AppError } from "@/middlewares/error.middleware.js";
import { DomainSchema } from "@repo/common/schemas";
import { Request, Response } from "express";
import { UserDomainService } from "./userDomain.service.js";

export const UserDomainController = {
  createDomain: async (req: Request, res: Response) => {
    const domainPayload = DomainSchema.parse(req.body);
    const userId = req.session.userId;
    const domain = await UserDomainService.createDomain(domainPayload, userId);

    return res.jsonSuccess({
      data: domain.data,
      message: domain.message,
      status: domain.status,
    });
  },
  getDomainsList: async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const domains = await UserDomainService.getDomains(userId);

    const data = domains?.map((domain) => {
      const { _count, ...restData } = domain;
      return { ...restData, feedbacksCount: _count?.feedback };
    });

    return res.jsonSuccess({
      data: data,
      message: `Domains fetched successfully !`,
      status: 200,
    });
  },
  getDomain: async (req: Request, res: Response) => {
    const { domainId } = req.params as { domainId: string };

    const domain = await UserDomainService.getDomain(domainId);

    return res.jsonSuccess({
      data: domain,
      message: `Domain fetched successfully !`,
      status: 200,
    });
  },
  updateDomainStatus: async (req: Request, res: Response) => {
    const status = req.body.status;

    const { domainId } = req.params as { domainId: string };

    console.log("domainId", domainId);

    if (!domainId) {
      throw new Error("DomainID is required");
    }

    const currentStatus = await UserDomainService.updateDomainStatus({
      status,
      domainId,
    });

    return res.jsonSuccess({
      data: currentStatus,
      message: `Status changed for Domain ${currentStatus.name}`,
      status: 200,
    });
  },
  deleteDomain: async (req: Request, res: Response) => {
    const { domainId } = req.params as { domainId: string };

    const domain = await UserDomainService.deleteDomain({ domainId });
    return res.jsonSuccess({
      data: domain.name,
      message: `${domain.name} is successfully deleted.`,
      status: 200,
    });
  },
  checkUserHasDomain: async (req: Request, res: Response) => {
    const { hasDomains, length, domains } =
      await UserDomainService.checkUserHasDomain({
        userId: req.user.id,
      });

    return res.jsonSuccess({
      data: { domains, hasDomains, length: length },
      message: `${req.user.name} has total ${length} domains`,
      status: 200,
    });
  },
  regenerateClientId: async (req: Request, res: Response) => {
    const { domainId } = req.params as { domainId: string };
    const data = await UserDomainService.regenerateClientId({ domainId });
    return res.jsonSuccess({
      data: data.data,
      message: data.message,
      status: data.status,
    });
  },
  verifyClientId: async (req: Request, res: Response) => {
    const { clientId } = req.query as { clientId: string };

    if (!clientId) {
      throw new AppError("ClientID not found", 404);
    }
    const origin = req.headers.origin || req.headers.referer;
    if (!origin) {
      throw new AppError("Origin not found", 404);
    }

    let hostname = new URL(origin).hostname;

    if (hostname.includes("localhost")) {
      hostname = "working.mail.com";
      /**
       * why i did this bcoz in our database , there is no record for localhost in domains table.. so our database checks will get failed.
       *
       * we can't change origin by passing origin in header coz browser restricts it and we have added checks on "origin" only in our express...
       *
       * that's why we have to do this ( workaround )
       * later , add multiple dummy origins.
       */
    }
    const { data } = await UserDomainService.validateClientId({
      clientId: clientId || "",
      hostname,
    });

    if (data.domain) {
      return res.jsonSuccess({
        data: {
          valid: true,
        },
        message: "validated",
        status: 200,
      });
    }
  },
};
