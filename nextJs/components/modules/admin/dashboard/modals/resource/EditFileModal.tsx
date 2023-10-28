import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { trpc } from '@/app/_trpc/client';
import { useUploadThing } from '@/utils/uploadthing';
import { Dispatch, SetStateAction, SyntheticEvent, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Resource } from '@/types/types';
import toast from 'react-hot-toast';

const EditFileModal = ({
  resource,
  isOpen,
  setIsOpen,
  refetchResources,
}: {
  resource: Resource;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  refetchResources: any;
}) => {
  const [file, setFile] = useState<any>(null);

  const { startUpload: startFileUpload, isUploading: isFileUploading } =
    useUploadThing('fileUploader', {
      onUploadError: (e) => {
        throw e;
      },
    });

  const {
    mutateAsync: updateResource,
    isLoading,
    isError,
    error,
  } = trpc.admin.resource.update.useMutation({
    onSuccess: () => {
      refetchResources();
    },
  });

  const changeFile = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const fileResp = await startFileUpload([file]);
      if (!fileResp) {
        toast.error('There was an error uploading the file.');
        return;
      }
      toast.promise(
        new Promise(async (resolve, reject) => {
          try {
            await updateResource({
              id: resource?.id!,
              file: fileResp[0],
            });
            resolve(true);
          } catch (error: any) {
            reject(error);
          }
        }),
        {
          loading: 'Uploading...',
          success: () => {
            setFile(null);
            setIsOpen(false);
            return 'Uploaded.';
          },
          error: () => {
            return 'There was an error uploading the resource.';
          },
        }
      );
    } catch (error: any) {
      console.log(error);
      toast.error('There was an error updating the resource.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit File</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={changeFile}
          className="flex flex-col justify-start items-center
        gap-2"
        >
          <Label className="w-full text-start text-md font-semibold">
            Upload File
          </Label>
          <div className="w-full flex justify-center items-center gap-2 h-auto">
            <Input
              placeholder="File"
              value={file?.name || resource?.file?.fileName}
              type="text"
              className="w-2/3  h-12 text-black-txt text-xs md:text-sm font-semibold"
              readOnly
            />

            <Input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files && e.target?.files[0]);
              }}
              accept=".pdf,.ppt,.doc,.docx"
            />
            <Button
              className="w-1/3 h-12 text-white text-lg
                font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
                hover:bg-[#8449BF] hover:text-white   flex justify-center items-center gap-2"
              onClick={() => document.getElementById('fileUpload')?.click()}
              type="button"
            >
              {isFileUploading ? (
                <>
                  <Spinner className="text-white h-6 w-6" />
                  <p className="font-semibold">Uploading...</p>
                </>
              ) : (
                'Select File'
              )}
            </Button>
          </div>
          <DialogFooter className="mt-5">
            <Button
              className="w-auto h-10 flex justify-center items-center
            bg-white text-black sm:text-md text-sm hover:bg-white border-[1px]"
              onClick={() => {
                if (isFileUploading) {
                  alert('a file is uploadng...');
                } else {
                  setIsOpen(false);
                  setFile(null);
                }
              }}
              type="button"
            >
              Cancel
            </Button>

            <Button
              className="w-auto h-10 text-white text-lg
              font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
              hover:bg-[#8449BF] hover:text-white flex justify-center items-center gap-2"
              type="submit"
            >
              {isLoading ? (
                <>
                  <Spinner className="text-white h-6 w-6" />
                  <p className="font-semibold">Saving...</p>
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFileModal;
