import { prisma, Prisma as PrismaTypes } from "@/lib/prisma-orm/prisma.js";
import { AppError } from "@/middlewares/error.middleware.js";
import { TDomainPayload } from "@repo/common/schemas";

import { ServiceResponse } from "@repo/common/types";
import { generateApiKey, hashFunction } from "@repo/utils/server";
export const UserDomainService = {
  createDomain: async (
    { name, url }: TDomainPayload,
    userId: string,
  ): Promise<ServiceResponse> => {
    const isDomainPresent = await prisma.domain.findFirst({
      where: {
        url,
      },
    });

    if (isDomainPresent?.id) {
      throw new AppError(
        "Domain already present. Try with different domain.",
        409,
        "ALREADY_PRESENT",
      );
    }

    const clientId = generateApiKey();
    const hashedClientId = hashFunction(clientId);

    console.log("userId", userId);
    const domainCreated = await prisma.domain.create({
      data: {
        name,
        clientId: hashedClientId,
        status: "ACTIVE",
        url,
        userId,
      },
    });

    return {
      data: {
        clientId,
        domainId: domainCreated.id,
      },
      message: "Domain Created Successfully",
      status: 200,
    };
  },
  getDomains: async (userId: string) => {
    return await prisma.domain.findMany({
      where: {
        userId,
      },
      omit: {
        clientId: true,
      },
      include: {
        _count: {
          select: { feedback: true },
        },
      },
    });
  },
  getDomain: async (domainId: string) => {
    return await prisma.domain.findUnique({
      where: {
        id: domainId,
      },
    });
  },
  updateDomainStatus: async ({
    status,
    domainId,
  }: {
    status: PrismaTypes.DOMAIN_STATUS;
    domainId: string;
  }) => {
    const existingDomain = await prisma.domain.findUnique({
      where: {
        id: domainId,
      },
    });

    if (!existingDomain) {
      throw new AppError(
        "Domain Doesn't exist. Please check domain id or try to make request with a valid user id.",
      );
    }

    const updateOperation = await prisma.domain.update({
      data: {
        status,
      },
      where: {
        id: domainId,
      },
      select: {
        status: true,
        name: true,
        updatedAt: true,
      },
    });

    return updateOperation;
  },
  deleteDomain: async ({ domainId }: { domainId: string }) => {
    const existingDomain = await prisma.domain.findUnique({
      where: {
        id: domainId,
      },
    });

    if (!existingDomain) {
      throw new AppError(
        "Domain Doesn't exist. Please check domain id or try to make request with a valid user id.",
      );
    }
    const deletedDomain = await prisma.domain.delete({
      where: {
        id: domainId,
      },
      select: {
        name: true,
      },
    });

    return deletedDomain;
  },
  checkUserHasDomain: async ({ userId }: { userId: string }) => {
    const domains = await prisma.domain.findMany({
      where: {
        userId,
      },
    });
    const domainsLength = domains.length;
    const hasDomains = domainsLength > 0 ? true : false;

    return {
      domains,
      hasDomains,
      length: domainsLength,
    };
  },

  regenerateClientId: async ({ domainId }: { domainId: string }) => {
    if (!domainId) {
      throw new AppError("Domain ID is required", 400, "REQUIRED");
    }
    const clientId = generateApiKey();
    const hashedClientId = hashFunction(clientId);

    const newUpdatedRecord = await prisma.domain.update({
      where: {
        id: domainId,
      },
      data: {
        clientId: hashedClientId,
      },
    });

    return {
      data: {
        clientId,
        domainId: newUpdatedRecord.id,
      },
      message: "Regenerated Client ID",
      status: 200,
    };
  },

  validateClientId: async ({
    clientId,
    hostname,
  }: {
    clientId: string;
    hostname: string;
  }) => {
    if (!clientId) {
      throw new AppError("Missing Client ID", 400, "NOT_FOUND");
    }

    const isLocalhost = hostname.includes("localhost");

    const hashedclientId = hashFunction(clientId);
    const domain = await prisma.domain.findFirst({
      where: { clientId: hashedclientId, url: hostname },
    });

    if (!domain) {
      throw new AppError("Invalid Client ID", 400);
    }

    console.log("SERVICE DOMAIN", domain);

    return {
      data: { domain },
      message: "validated client id",
      status: 200,
    };
  },
};
