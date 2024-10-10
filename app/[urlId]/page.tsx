import { getLink } from "./fetch";
import { redirect } from "next/navigation";
import styles from "./styles.module.scss"
export default async function Page({ params }: { params: { urlId: string } }) {
  const link = await getLink(params.urlId);
  if (link.fullUrl) {
    redirect(link.fullUrl);
  }
  if (link.code === 404) {
    return (
      <div className={styles.containerError}>
        <h2>OOOOPS!</h2>
        <h1>404</h1>
        <p>We didn&apos;t find the link you&apos;re looking for!</p>
      </div>
    );
  }

  return (
    <div className={styles.containerError}>
      <h2>Something went wrong...</h2>
      <h1>{link.code}</h1>
      <p>Sorry about that!</p>
    </div>
  );
}
