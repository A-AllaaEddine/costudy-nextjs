import CustomSelect from '@/components/commun/static/Select';
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
import { Textarea } from '@/components/ui/textarea';
import { Resource } from '@/types/types';
import { trpc } from '@/app/_trpc/client';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';

const EditInfoModal = ({
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
  const [formFields, setFormFields] = useState(resource);

  useEffect(() => {
    setFormFields(resource);
  }, [resource]);

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

    if (formFields?.description.length < 50) {
      toast.error('Description must be at least 50 characters.');
      return;
    }
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await updateResource({
            id: resource?.id!,
            ...formFields,
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
          setIsOpen(false);
          return 'Saved.';
        },
        error: () => {
          return 'There was an error saving the data.';
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
          {resource?.type == 'video' && (
            <>
              <Label className="text-md font-semibold w-full text-start">
                Video URL
              </Label>
              <Input
                placeholder="Video URL"
                value={formFields?.video?.url}
                type="text"
                required
                onChange={handleChange}
                name="video"
                className="w-full  h-12 text-black-txt text-xs md:text-sm font-semibold"
              />
            </>
          )}
          <Label className="text-md font-semibold w-full text-start">
            Title
          </Label>
          <Input
            placeholder="Title"
            value={formFields?.title}
            type="text"
            required
            onChange={handleChange}
            name="title"
            className="w-full  h-12 text-black-txt text-xs md:text-sm font-semibold"
          />
          <Label className="text-md font-semibold w-full text-start">
            Description
          </Label>
          <Textarea
            name="description"
            className="w-full h-auto resize-none text-black-txt ttext-xs md:text-sm font-semibold"
            onChange={handleChange}
            value={formFields?.description}
            minLength={50}
          />
          <Label className="text-md font-semibold w-full text-start">
            Class
          </Label>
          <Input
            placeholder="Class"
            value={formFields?.class}
            type="text"
            required
            onChange={handleChange}
            name="class"
            className="w-full h-12 text-black-txt ttext-xs md:text-sm font-semibold"
          />
          <Label className="text-md font-semibold w-full text-start">
            Author
          </Label>
          <Input
            placeholder="Author"
            value={formFields?.by}
            type="text"
            required
            onChange={handleChange}
            name="by"
            className="w-full h-12 text-black-txt ttext-xs md:text-sm font-semibold"
          />
          <Label className="text-md font-semibold w-full text-start">
            Major
          </Label>
          <CustomSelect
            options={majorOptions}
            onChange={onSelectMajor}
            className="w-full h-12 rounded-md bg-white border-[1px] "
          />
          <Label className="text-md font-semibold w-full text-start">
            Degree
          </Label>
          <CustomSelect
            options={degreeOptions}
            onChange={onSelectDegree}
            className="w-full h-12 rounded-md bg-white border-[1px] "
          />
          <Label className="text-md font-semibold w-full text-start">
            Year
          </Label>
          <CustomSelect
            options={yearOptions}
            onChange={onSelectYear}
            className="w-full h-12 rounded-md bg-white border-[1px] "
          />
          <DialogFooter className="mt-5">
            <Button
              className="w-auto h-10 flex justify-center items-center
            bg-white border border-slate-200 rounded-md text-black sm:text-md text-sm hover:bg-white border-[1px font-bold]"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className="w-auto h-10 text-white text-lg
              font-bold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
              hover:bg-[#8449BF] hover:text-white flex justify-center items-center gap-2"
              type="submit"
            >
              {isLoading ? (
                <>
                  <Spinner className="text-white h-6 w-6" />
                  <p className="font-bold">Saving...</p>
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

export default EditInfoModal;

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
