import styles from "./ResourceCard.module.scss";
import resImg from "../../../../public/resource.svg";
import Image from "next/image";
import { useRouter } from "next/router";

type Resource = {
  url?: string;
  name: string;
  imgUrl: string;
};
const ResourceCard = ({ url, imgUrl, name }: Resource) => {
  const router = useRouter();
  return (
    <div className={styles.resource} onClick={() => router.push(url)}>
      <Image src={resImg} alt="resource" className={styles.resourceBg} />
      <Image
        src={imgUrl}
        width={100}
        height={100}
        alt="logo"
        className={styles.resourceImg}
      />
      <p className={styles.title}>{name}</p>
    </div>
  );
};

export default ResourceCard;
