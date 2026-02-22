import { ApiResponse } from "@repo/common/types";
import { IDomainType } from "../getDomainService/useGetDomainService.types.ts";

interface IGetDomain {
  domains: IDomainType[];
  hasDomains: boolean;
  length: number;
}

type IGetDomainExistResponse = ApiResponse<IGetDomain>;

export type { IGetDomain, IGetDomainExistResponse };
