import { getLink } from "./fetch";
import { redirect } from "next/navigation";
import * as S from "./styles";

export default async function Page({ params }: { params: { urlId: string } }) {
  const link = await getLink(params.urlId);
  if (link.fullUrl) {
    redirect(link.fullUrl);
  }
  if (link.code === 404) {
    return (
      <S.ContainerError>
        <h2>OOOOPS!</h2>
        <h1>404</h1>
        <p>We didn't find the page you're looking for!</p>
      </S.ContainerError>
    );
  }

  return (
    <S.ContainerError>
      <h2>Something went wrong...</h2>
      <h1>{link.code}</h1>
      <p>Sorry about that!</p>
    </S.ContainerError>
  );
}
