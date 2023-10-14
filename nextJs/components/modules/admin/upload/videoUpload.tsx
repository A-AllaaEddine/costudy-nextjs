import CustomSelect from '@/components/commun/static/Select';
import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/utils/trpc';
import { useUploadThing } from '@/utils/uploadthing';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

type FormFields = {
  title: string;
  description: string;
  class: string;
  major: string;
  type: 'video';
  degree: string;
  year: string;
  by: string;
  video: {
    url: string;
  };
};
const defaultFormFields: FormFields = {
  title: '',
  description: '',
  class: '',
  major: '',
  degree: '',
  year: '',
  by: '',
  type: 'video',
  video: {
    url: '',
  },
};

const VideoUpload = () => {
  const [formFields, setFormFields] = useState<FormFields>(defaultFormFields);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [thmbUploadProgress, setThmbUploadProgress] = useState<number>(0);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

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
  } = trpc.admin.resource.upload.video.useMutation();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'video') {
      setFormFields((prev) => {
        return { ...prev, [name]: { url: value } };
      });
      return;
    }

    setFormFields((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!formFields?.title.length) {
      Toast('error', 'Please set the title of the resource.');
      return;
    }
    if (formFields?.description.length < 50) {
      Toast('error', 'Description must be at least 50 characters.');
      return;
    }
    if (!formFields?.class.length) {
      Toast('error', 'Please set the class of the resource.');
      return;
    }
    if (!formFields?.major.length) {
      Toast('error', 'Please set the major of the resource.');
      return;
    }
    if (!formFields?.degree.length) {
      Toast('error', 'Please set the degree of the resource.');
      return;
    }
    if (!formFields?.year.length) {
      Toast('error', 'Please set the year of the resource.');
      return;
    }
    if (!thumbnail) {
      Toast('error', 'Please upload a thumbnail.');
      return;
    }

    try {
      const thumbnailResp = await startThumbnailUpload([thumbnail]);

      if (thumbnailResp) {
        await submitResource({
          title: formFields?.title,
          description: formFields?.description,
          class: formFields?.class,
          major: formFields?.major,
          degree: formFields?.degree,
          year: formFields?.year,
          by: formFields?.by,
          type: formFields?.type,
          video: formFields?.video,
          thumbnail: thumbnailResp[0],
        });
      }

      Toast('success', 'Resource has been uploaded successfully.');
      resetFormFields();
    } catch (error: any) {
      console.log(error);
      if (error.message === 'Resource exist') {
        Toast('error', 'The resource already exist.');
        return;
      }
      Toast('error', 'There was an error submitting the resource.');
    }
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
              className="mt-2"
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
            hover:bg-[#8449BF] hover:text-white  mt-3
            flex justify-center items-center gap-1"
            onClick={() => document.getElementById('thumbnailUpload')?.click()}
            type="button"
            disabled={isLoading || isThumbnailUploading}
          >
            {isLoading || isThumbnailUploading ? (
              <>
                <Spinner className="text-white h-6 w-6" />
                <p className="font-semibold">Uploading...</p>
              </>
            ) : (
              'Select Thumbnail'
            )}
          </Button>
        </div>
        <Label className="text-md font-semibold">Video URL</Label>
        <Input
          placeholder="Video URL"
          value={formFields?.video.url}
          type="text"
          required
          onChange={handleChange}
          name="video"
          className="w-full  h-12 text-black-txt text-xs md:text-sm font-semibold"
        />{' '}
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
          className="w-full h-auto text-black-txt ttext-xs md:text-sm font-semibold"
          onChange={handleChange}
          name="description"
          value={formFields?.description}
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
        {isLoading || isThumbnailUploading ? (
          <div
            className="w-full h-12 flex flex-row justify-center items-center
            bg-[#8449BF] rounded-md"
          >
            <Spinner className="text-[#1D1D1F] h-8 w-8" />
          </div>
        ) : (
          <Button
            className="w-full h-12 text-white text-lg
            font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
            hover:bg-[#8449BF] hover:text-white  mt-3"
            type="submit"
            disabled={isLoading || isThumbnailUploading}
          >
            Submit
          </Button>
        )}
      </form>
    </div>
  );
};

export default VideoUpload;

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
