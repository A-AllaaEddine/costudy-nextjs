import Spinner from '@/components/commun/Spinner/spinner.component';
import Toast from '@/components/commun/static/Toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SignInResponse, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

const defaultFormFields = {
  email: '',
  password: '',
};
const Main = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassInput, setShowPassInput] = useState<boolean>(false);

  const { email, password } = formFields;

  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'email') {
      if (value.length > 0) {
        setShowPassInput(true);
      } else {
        setShowPassInput(false);
      }
    }

    setFormFields({ ...formFields, [name]: value });
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (email.length < 1) {
      Toast('warning', 'Please type your email!');
      return;
    }

    if (password.length < 8) {
      // alert("password must be at least  8 chacacters !");
      Toast('warning', 'Password must be at least  8 chacacters !');
      return;
    }

    try {
      setIsLoading(true);
      const resp: SignInResponse | undefined = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      setIsLoading(false);
      if (!resp?.ok) {
        switch (resp?.error) {
          case 'No user':
            Toast('warning', 'No user with this email');
            break;
          case 'Wrong Password':
            Toast('warning', 'Wrong Password !');
            break;
          case 'suspended':
            Toast('warning', 'Your account has been suspended');
            break;
          case 'banned':
            Toast('warning', 'Your account is banned');
            break;
          default:
            Toast('error', 'There was an error siging you in!');
            console.log('Error: ' + resp?.error);
            break;
        }
      }
      resetFormFields();
      if (router.query.destination) {
        router.push(
          `${decodeURIComponent(router.query.destination as string)}`
        );
        return;
      }
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <p className="w-auto h-auto p-2 text-4xl font-bold">
        Oh! Is it exams time again? 😏
      </p>
      <form
        className="w-[30rem] h-auto p-8 flex flex-col justify-center items-center gap-4
          "
        onSubmit={handleSubmit}
      >
        <Input
          className="w-full h-12 text-black-txt text-sm font-semibold"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
        />
        {showPassInput && (
          <Input
            className="w-full h-12 text-black-txt text-sm font-semibold"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
          />
        )}
        <p className=" h-10 text-sm font-medium text-black-txt hover:cursor-pointer">
          Forgot password?
        </p>
        <div className="w-full h-12 flex flex-col justify-center items-center">
          {isLoading ? (
            <div
              className="w-full h-12 flex flex-row justify-center items-center
            bg-[#8449BF] rounded-md"
            >
              <Spinner bgColor="#8449BF" />
            </div>
          ) : (
            <Button
              type="submit"
              className="w-full h-12 text-white text-lg
            font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
            hover:bg-[#8449BF] hover:text-white"
            >
              Log in
            </Button>
          )}
        </div>
        <Separator className="mt-2 mb-2" />
        <p
          className="text-md text-center font-semibold flex flex-row justify-between items-center
        gap-2"
        >
          Not a member?{' '}
          <Link
            href={'/join'}
            className="text-black-txt no-underline font-bold"
          >
            Join now
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Main;
