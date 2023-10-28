import LatestUsersCard from '@/components/modules/admin/dashboard/cards/lastest/LatestUsersCard';
import ResourcesCountCard from '@/components/modules/admin/dashboard/cards/resources/ResourcesCountCard';
import UsersCountCard from '@/components/modules/admin/dashboard/cards/users/UsersCountCard';
import UsersGrowthGraph from '@/components/modules/admin/dashboard/graphs/UsersGrowthGraph';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isAdmin } from '@/utils/serserSideUtils';
import { Metadata } from 'next';

const OverView = async () => {
  return (
    <Card
      className=" w-full h-full flex flex-col justify-start items-start gap-4  pt-8 pb-8 
        pl-3 pr-3 "
    >
      <CardHeader className="h-8 flex justify-center items-center">
        <CardTitle className="flex justify-center w-full text-lg font-bold">
          Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col justify-start items-center gap-4">
        <div className="w-full h-auto  flex justify-start items-start gap-3">
          <UsersCountCard />
          <ResourcesCountCard />
        </div>
        <div className="w-full h-[500px] flex justify-center items-center gap-5">
          <div
            className="w-4/6 h-full border-[1px] border-slate-300 rounded-xl p-6
                flex flex-col justify-center items-start gap-5"
          >
            <p className="text-xl text-black font-bold">Users</p>
            <UsersGrowthGraph />
          </div>
          <LatestUsersCard />
        </div>
      </CardContent>
    </Card>
  );
};

export default OverView;
