import Meta from '@/components/commun/static/Meta';
import Main from '@/components/modules/admin/upload/main';
import { checkServerSession } from '@/utils/serserSideUtils';
import { NextApiRequest, NextApiResponse } from 'next';

const Upload = () => {
  return (
    <>
      <Meta title="Co Study" description="Generated by create next app" />
      <Main />
    </>
  );
};

export default Upload;

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const user = await checkServerSession(req, res);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        statusCode: 302,
      },
    };
  }
  if (user?.type !== 'admin') {
    return {
      redirect: {
        destination: '/',
        statusCode: 302,
      },
    };
  }
  return {
    props: {},
  };
};
