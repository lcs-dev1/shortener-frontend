import { AxiosError } from "axios"
interface ErrorMessage {
	message: string,
	error: string,
	statusCode: number
}
export function catchError(error: unknown) {
  const err = error as AxiosError<ErrorMessage>
  
  return err.response?.data.message
}