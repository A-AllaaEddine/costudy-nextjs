import Head from 'next/head';

const Meta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8"></meta>
    </Head>
  );
};

export default Meta;
