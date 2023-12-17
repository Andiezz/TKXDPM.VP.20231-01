import { SORT_ORDER } from "../configs/constants";

export interface IPaginationDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SORT_ORDER;
}