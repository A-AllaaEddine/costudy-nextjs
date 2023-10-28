import Meta from '@/components/commun/static/Meta';
import Main from '@/components/modules/admin/upload/main';
import { checkServerSession, isAdmin } from '@/utils/serserSideUtils';
import { Metadata, NextApiRequest, NextApiResponse } from 'next';

export const metadata: Metadata = {
  title: 'Upload | CoStudy',
  description: 'Track your website status.',
};

const Upload = async () => {
  await isAdmin();

  return (
    <>
      <Main />
    </>
  );
};

export default Upload;
