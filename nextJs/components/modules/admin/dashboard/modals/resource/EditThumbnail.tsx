import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Resource } from '@/types/types';
import { trpc } from '@/app/_trpc/client';
import { useUploadThing } from '@/utils/uploadthing';
import { Dispatch, SetStateAction, SyntheticEvent, useState } from 'react';
import toast from 'react-hot-toast';

const EditThumbnail = ({
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
  const [thumbnail, setThumbnail] = useState<any>(null);

  const {
    startUpload: startThumbnailUpload,
    isUploading: isThumbnailUploading,
  } = useUploadThing('imageUploader', {
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
      const thumbnailResp = await startThumbnailUpload([thumbnail]);
      if (!thumbnailResp) {
        toast.error('There was an error uploading the thumbnail.');
        return;
      }

      toast.promise(
        new Promise(async (resolve, reject) => {
          try {
            await updateResource({
              id: resource?.id!,
              thumbnail: thumbnailResp[0],
            });

            if (isError) {
              throw error;
            }

            resolve(true);
          } catch (error: any) {
            reject(error);
          }
        }),
        {
          loading: 'Saving...',
          success: () => {
            setThumbnail(null);
            setIsOpen(false);
            return 'Saved.';
          },
          error: () => {
            return 'There was an error saving the data';
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
            Upload Thumbnail
          </Label>
          <div className="w-full flex justify-center items-center gap-2 h-auto">
            <Input
              placeholder="Thumbnail"
              value={thumbnail?.name || resource?.thumbnail?.fileName}
              type="text"
              className="w-3/5  h-12 text-black-txt text-xs md:text-sm font-semibold"
              readOnly
            />

            <Input
              type="file"
              id="thumbnailUpload"
              className="hidden"
              onChange={(e) => {
                setThumbnail(e.target.files && e.target?.files[0]);
              }}
              accept=".png,.jpeg,.jpg"
            />
            <Button
              className="w-2/5 h-12 text-white text-lg
                font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
                hover:bg-[#8449BF] hover:text-white   flex justify-center items-center gap-2"
              onClick={() =>
                document.getElementById('thumbnailUpload')?.click()
              }
              type="button"
            >
              {isThumbnailUploading ? (
                <>
                  <Spinner className="text-white h-6 w-6" />
                  <p className="font-semibold">Uploading...</p>
                </>
              ) : (
                'Select Thumbnail'
              )}
            </Button>
          </div>
          <DialogFooter className="mt-5">
            <Button
              className="w-auto h-10 flex justify-center items-center
            bg-white text-black sm:text-md text-sm hover:bg-white border-[1px]"
              onClick={() => {
                if (isThumbnailUploading) {
                  alert('a file is uploadng...');
                } else {
                  setIsOpen(false);
                  setThumbnail(null);
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

export default EditThumbnail;
