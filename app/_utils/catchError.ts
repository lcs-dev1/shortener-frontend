import { AxiosError } from "axios";
interface ErrorMessage {
  message: string;
  error: string;
  statusCode: number;
}
export function catchError(error: unknown, handleError?: undefined): string;
export function catchError(error: unknown, handleError: true): AxiosError<ErrorMessage>;
export function catchError(error: unknown, handleError?: boolean) {
  const err = error as AxiosError<ErrorMessage>;
  if (!handleError) {
    return err.response?.data.message;
  }
  return err
}
