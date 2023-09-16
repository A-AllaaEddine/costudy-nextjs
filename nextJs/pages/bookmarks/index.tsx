import Main from '@/components/modular/bookmarks/main';
import Head from 'next/head';

const Resources = () => {
  return (
    <>
      <Head>
        <title>Co Study</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main />
    </>
  );
};
export default Resources;

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
