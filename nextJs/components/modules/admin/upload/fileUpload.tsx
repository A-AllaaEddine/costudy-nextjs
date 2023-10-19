import CustomSelect from '@/components/commun/static/Select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { trpc } from '@/utils/trpc';
import { useUploadThing } from '@/utils/uploadthing';

import Spinner from '@/components/commun/static/spinner';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

type FormFields = {
  title: string;
  description: string;
  class: string;
  major: string;
  type: 'pdf';
  degree: string;
  year: string;
  by: string;
};
const defaultFormFields: FormFields = {
  title: '',
  description: '',
  class: '',
  major: '',
  degree: '',
  year: '',
  by: '',
  type: 'pdf',
};
const FileUpload = () => {
  const [formFields, setFormFields] = useState<FormFields>(defaultFormFields);
  const [file, setFile] = useState<any>(null);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [thmbUploadProgress, setThmbUploadProgress] = useState<number>(0);
  const [filUploadProgress, setFileUploadProgress] = useState<number>(0);

  const router = useRouter();

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };
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

  const {
    mutateAsync: submitResource,
    isLoading,
    isError,
    error,
  } = trpc.admin.resource.upload.file.useMutation();

  const {
    mutateAsync: checkResource,
    isError: isExistError,
    error: existError,
    isLoading: isCheckingResource,
  } = trpc.admin.resource.upload.check.useMutation();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormFields((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!formFields?.title.length) {
      toast.error('Please set the title of the resource.');
      return;
    }
    const regex = /^[a-zA-Z0-9_ -|]+$/i;
    const isValid = regex.test(formFields?.title);

    if (!isValid) {
      toast.error(
        'Only characters, numbers and dashes are allowed in Title field.'
      );
      return;
    }
    if (formFields?.description.length < 50) {
      toast.error('Description must be at least 50 characters.');
      return;
    }

    if (!formFields?.class.length) {
      toast.error('Please set the class of the resource.');
      return;
    }
    if (!formFields?.major.length) {
      toast.error('Please set the major of the resource.');
      return;
    }
    if (!formFields?.degree.length) {
      toast.error('Please set the degree of the resource.');
      return;
    }
    if (!formFields?.year.length) {
      toast.error('Please set the year of the resource.');
      return;
    }
    if (!file) {
      toast.error('Please upload a file.');
      return;
    }
    if (!thumbnail) {
      toast.error('Please upload a thumbnail.');
      return;
    }

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await checkResource({ title: formFields?.title });

          if (isExistError) {
            throw isExistError;
          }
          const fileResp = await startFileUpload([file]);
          const thumbnailResp = await startThumbnailUpload([thumbnail]);

          if (!fileResp) {
            throw new Error('There was an error uploading the file.');
          }
          if (!thumbnailResp) {
            throw new Error('There was an error uploading the thumbnail.');
          }
          if (fileResp && thumbnailResp) {
            await submitResource({
              title: formFields?.title,
              description: formFields?.description,
              class: formFields?.class,
              major: formFields?.major,
              degree: formFields?.degree,
              year: formFields?.year,
              by: formFields?.by,
              type: formFields?.type,
              thumbnail: thumbnailResp[0],
              file: fileResp[0],
            });
          }

          resolve(true);
        } catch (error: any) {
          reject(error);
        }
      }),
      {
        loading: 'Upaloding...',
        success: () => {
          router.reload();
          resetFormFields();
          return 'Resource uploaded.';
        },
        error: (err) => {
          console.log(err);
          if (err.message === 'Resource exist') {
            return 'The resource already exist.';
          }
          return 'There was an error submitting the resource.';
        },
      }
    );
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
    <div className="h-full w-full">
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
              className="mt-2 h-3 bg-white "
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
            disabled={isLoading || isThumbnailUploading || isFileUploading}
          >
            {isLoading || isThumbnailUploading || isFileUploading ? (
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
              className="mt-2 h-3"
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
            onClick={() => document.getElementById('thumbnailUpload')?.click()}
            type="button"
            disabled={isLoading || isThumbnailUploading || isFileUploading}
          >
            {isLoading || isThumbnailUploading || isFileUploading ? (
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
          disabled={
            isLoading ||
            isThumbnailUploading ||
            isFileUploading ||
            isCheckingResource
          }
        >
          {isCheckingResource ? (
            <>
              <Spinner className="text-white h-6 w-6" />
              <p className="font-semibold">Checking...</p>
            </>
          ) : isLoading || isThumbnailUploading || isFileUploading ? (
            <>
              <Spinner className="text-white h-6 w-6" />
              <p className="font-semibold">Uploading...</p>
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </div>
  );
};
export default FileUpload;

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
