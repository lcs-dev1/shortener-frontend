"use server";
import { api } from "../_services/api";
import { catchError } from "../_utils/catchError";

export const getLink = async (id: string): Promise<{fullUrl?: string; code?:number}> => {
  try {
    const res = await api.get(`${id}`);
    const data = res.data as { fullUrl: string };
    return data;
  } catch (e) {
    const error = catchError(e, true)
    return { fullUrl: undefined, code: error.response?.status };
  }
};
