import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Toast from '@/components/commun/static/Toast';
import { trpc } from '@/utils/trpc';
import Spinner from '@/components/commun/static/spinner';
import DeleteModal from '@/components/commun/modals/DeleteModal';

const DangerZone = () => {
  return (
    <div className="w-4/5 h-auto flex flex-col justify-start items-start gap-4 mt-8">
      <Label className="w-full sm:w-4/5 max-w-[400px] text-sm sm:text-md">
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
