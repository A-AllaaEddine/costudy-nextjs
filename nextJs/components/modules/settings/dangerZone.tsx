import DeleteModal from '@/components/commun/modals/DeleteModal';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const DangerZone = () => {
  return (
    <div className="w-4/5 h-auto flex flex-col justify-start items-start gap-4">
      <Label className="hidden lg:block text-md h-auto font-bold w-4/5 text-start">
        Danger Zone
      </Label>
      <Label className="text-sm h-auto w-4/5 text-start">
        Request to delete your account. This action cannot be undone.
      </Label>
      <Separator className="w-4/5" />
      <Label className="w-full sm:w-4/5 max-w-[400px] text-sm font-semibold sm:text-md">
        Looking to delete your account?
      </Label>
      <Label className="w-full sm:w-4/5 max-w-[400px] sm:text-sm text-xs text-slate-500">
        Be careful because this action cannot be reversed!
      </Label>
      <DeleteModal />
    </div>
  );
};

export default DangerZone;
