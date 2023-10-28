import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import CustomSelect from '@/components/commun/static/Select';
import Spinner from '@/components/commun/static/spinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/app/_trpc/client';
import { useUploadThing } from '@/utils/uploadthing';
import toast from 'react-hot-toast';

type FormFields = {
  title: string;
  description: string;
  type: string;
  class: string;
  major: string;
  degree: string;
  year: string;
  by: string;
  thumbnail: {
    fileKey: string;
    fileName: string;
    fileSize: 0;
    fileUrl: string;
    key: string;
    name: string;
    size: 0;
    url: string;
  };
  file?: {
    fileKey: string;
    fileName: string;
    fileSize: 0;
    fileUrl: string;
    key: string;
    name: string;
    size: 0;
    url: string;
  };
  video: {
    url: string;
  };
  createdAt: string;
  updatedAt: string;
};
const EditResourceModal = ({
  t,
  resourceId,
  isOpen,
  setIsOpen,
  refetchResources,
}: {
  t?: any;
  resourceId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  refetchResources: any;
}) => {
  const [formFields, setFormFields] = useState<FormFields>({
    title: '',
    description: '',
    type: '',
    class: '',
    major: '',
    degree: '',
    year: '',
    by: '',
    thumbnail: {
      fileKey: '',
      fileName: '',
      fileSize: 0,
      fileUrl: '',
      key: '',
      name: '',
      size: 0,
      url: '',
    },
    file: {
      fileKey: '',
      fileName: '',
      fileSize: 0,
      fileUrl: '',
      key: '',
      name: '',
      size: 0,
      url: '',
    },
    video: {
      url: '',
    },
    createdAt: '',
    updatedAt: '',
  });

  const [file, setFile] = useState<any>(null);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [thmbUploadProgress, setThmbUploadProgress] = useState<number>(0);
  const [filUploadProgress, setFileUploadProgress] = useState<number>(0);

  const {
    data: resource,
    isLoading: isLoadingUser,
    isError: isFetchingResourceError,
    error: userFetchingError,
    refetch: refetchUserInfo,
  } = trpc.resource.get.useQuery({
    id: resourceId,
  });
  const {
    mutateAsync: updateResource,
    isError: isUpdatingResourceError,
    error: updatingResourceError,
    isLoading,
  } = trpc.admin.resource.update.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      refetchResources();
    },
  });

  const { startUpload: startFileUpload, isUploading: isFileUploading } =
    useUploadThing('fileUploader', {
      onUploadProgress: (p) => setFileUploadProgress(p),
      onUploadError: (e) => {
        throw e;
      },
    });
  const {
    startUpload: startThumbnailUpload,
    isUploading: isThumbnailUploading,
  } = useUploadThing('imageUploader', {
    onUploadProgress: (p) => setThmbUploadProgress(p),
    onUploadError: (e) => {
      throw e;
    },
  });

  useEffect(() => {
    if (resource) {
      setFormFields(resource as FormFields);
    }
  }, [resource]);

  const handleSubmit = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await updateResource({ id: resourceId });
          if (isUpdatingResourceError) {
            throw updatingResourceError;
          }
          resolve(true);
        } catch (error: any) {
          reject(error.message);
        }
      }),
      {
        loading: 'Saving...',
        success: () => {
          setIsOpen(false);
          return 'Saved.';
        },
        error: () => {
          return 'There was an error saving the data.';
        },
      }
    );
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const onSelectMajor = (selectedMajor: string) => {
    if (selectedMajor === 'All Majors') {
      setFormFields((prev) => {
        return { ...prev, major: '', page: 1 };
      });
    } else {
      setFormFields((prev) => {
        return { ...prev, major: selectedMajor, page: 1 };
      });
    }
  };
  const onSelectDegree = (selectedDegree: string) => {
    if (selectedDegree === 'All Degrees') {
      setFormFields((prev) => {
        return { ...prev, degree: '', page: 1 };
      });
    } else {
      setFormFields((prev) => {
        return { ...prev, degree: selectedDegree, page: 1 };
      });
    }
  };
  const onSelectYear = (selecetdYear: string) => {
    if (selecetdYear === 'All Years') {
      setFormFields((prev) => {
        return { ...prev, year: '', page: 1 };
      });
    } else {
      setFormFields((prev) => {
        return { ...prev, year: selecetdYear, page: 1 };
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="md:w-4/5 w-[90%] rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {isFetchingResourceError ? (
          <div className="w-full h-full min-h-[13rem] flex justify-center items-center">
            <Spinner className="text-[#8449BF] h-8 w-8" />
          </div>
        ) : formFields.type === 'pdf' ? (
          <form
            className="w-full  h-full mt-6 flex flex-col justify-start items-start gap-2"
            onSubmit={handleSubmit}
          >
            <Label className="text-md font-semibold">Upload File</Label>
            <div className="w-full h-auto">
              <Input
                placeholder="File"
                value={file?.name}
                type="text"
                className="w-full  h-12 text-black-txt text-xs md:text-sm font-semibold"
                readOnly
              />
              {filUploadProgress > 5 && (
                <Progress
                  value={filUploadProgress}
                  className="mt-2 h-5 bg-white "
                />
              )}
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
                className="w-full h-12 text-white text-lg
                font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
                hover:bg-[#8449BF] hover:text-white  mt-3 flex justify-center items-center gap-2"
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
            <Label className="text-md font-semibold">Thumbnail</Label>
            <div className="w-full h-auto">
              <Input
                placeholder="Thumbnail"
                value={thumbnail?.name}
                type="text"
                className="w-full  h-12 text-black-txt text-xs md:text-sm font-semibold"
                readOnly
              />
              {thmbUploadProgress > 5 && (
                <Progress
                  value={thmbUploadProgress}
                  className="mt-2 h-5"
                  color="#8449BF"
                />
              )}
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
                className="w-full h-12 text-white text-lg
                font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
                hover:bg-[#8449BF] hover:text-white  mt-3 flex justify-center items-center gap-2"
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
            <Label className="text-md font-semibold">Title</Label>
            <Input
              placeholder="Title"
              value={formFields?.title}
              type="text"
              required
              onChange={handleChange}
              name="title"
              className="w-full  h-12 text-black-txt text-xs md:text-sm font-semibold"
            />
            <Label className="text-md font-semibold">Description</Label>
            <Textarea
              name="description"
              className="w-full h-auto text-black-txt ttext-xs md:text-sm font-semibold"
              onChange={handleChange}
            />
            <Label className="text-md font-semibold">Class</Label>
            <Input
              placeholder="Class"
              value={formFields?.class}
              type="text"
              required
              onChange={handleChange}
              name="class"
              className="w-full h-12 text-black-txt ttext-xs md:text-sm font-semibold"
            />
            <Label className="text-md font-semibold">Author</Label>
            <Input
              placeholder="Author"
              value={formFields?.by}
              type="text"
              required
              onChange={handleChange}
              name="by"
              className="w-full h-12 text-black-txt ttext-xs md:text-sm font-semibold"
            />
            <Label className="text-md font-semibold">Major</Label>
            <CustomSelect
              options={majorOptions}
              onChange={onSelectMajor}
              className="w-full h-12 rounded-md bg-white border-[1px] "
            />
            <Label className="text-md font-semibold">Degree</Label>
            <CustomSelect
              options={degreeOptions}
              onChange={onSelectDegree}
              className="w-full h-12 rounded-md bg-white border-[1px] "
            />
            <Label className="text-md font-semibold">Year</Label>
            <CustomSelect
              options={yearOptions}
              onChange={onSelectYear}
              className="w-full h-12 rounded-md bg-white border-[1px] "
            />

            <Button
              className="w-full h-12 text-white text-lg
                font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
                hover:bg-[#8449BF] hover:text-white  mt-3 flex justify-center items-center gap-2"
              type="submit"
            >
              {isLoading ? (
                <>
                  <Spinner className="text-white h-6 w-6" />
                  <p className="font-semibold">Uploading...</p>
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        ) : (
          <></>
        )}
        <DialogFooter>
          <Button
            className="w-auto h-10 flex justify-center items-center
            bg-white text-black sm:text-md text-sm hover:bg-white border-[1px]"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button
            className="w-auto h-10 text-white text-lg
              font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
              hover:bg-[#8449BF] hover:text-white flex justify-center items-center gap-2"
            type="submit"
            onClick={handleSubmit}
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
      </DialogContent>
    </Dialog>
  );
};

export default EditResourceModal;

const majorOptions = [
  { value: 'All Majors', label: 'All Majors' },
  {
    value: 'Computer Science and Technology',
    label: 'Computer Science and Technology',
  },
  {
    value: 'Science and Technology',
    label: 'Science and Technology',
  },
];
const degreeOptions = [
  { value: 'All Degrees', label: 'All Degrees' },
  {
    value: 'Bachelor',
    label: 'Bachelor',
  },
  {
    value: 'Master',
    label: 'Master',
  },
  {
    value: 'Phd',
    label: 'Phd',
  },
];
const yearOptions = [
  { value: 'All Years', label: 'All Years' },
  {
    value: '1st',
    label: '1st',
  },
  {
    value: '2nd',
    label: '2nd',
  },
  {
    value: '3rd',
    label: '3rd',
  },
  {
    value: '4th',
    label: '4th',
  },
];
