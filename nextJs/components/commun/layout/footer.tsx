import Link from 'next/link';
import { IoLogoInstagram } from 'react-icons/io';
import { IoLogoFacebook } from 'react-icons/io';
import { IoLogoLinkedin } from 'react-icons/io';

const Footer = () => {
  return (
    <div
      className="w-full h-auto pt-2 bg-[#8449BF] bg-opacity-10 flex flex-col justify-start items-center border-t-2
    "
    >
      <div
        className="flex flex-row flex-wrap justify-center gap-3 h-auto mt-2 pr-3 pl-3 
      text-black font-semibold"
      >
        <Link href="/about" className="hover:text-[#8449BF]">
          About
        </Link>
        <Link href="/terms-&-conditions" className="hover:text-[#8449BF]">
          Terms & Conditions
        </Link>
        <Link href="/terms-&-conditions" className="hover:text-[#8449BF]">
          Cookie Policy
        </Link>
        <Link href="/contact-us" className="hover:text-[#8449BF]">
          Contact us
        </Link>
      </div>
      <div className="flex flex-row flex-wrap gap-4 h-auto mt-3 p-2">
        <Link href="/instagram">
          <IoLogoInstagram className="w-7 h-7 hover:text-[#8449BF]" />
        </Link>
        <Link href="/facebook">
          <IoLogoFacebook className="w-7 h-7 hover:text-[#8449BF]" />
        </Link>
        <Link href="/linkedin">
          <IoLogoLinkedin className="w-7 h-7 hover:text-[#8449BF]" />
        </Link>
      </div>
      <div className=" h-10 mb-3 flex flex-row justify-center items-center">
        <p className="text-black-txt text-sm  font-semibold">
          © 2023 CoStudy.
        </p>
      </div>
    </div>
  );
};

export default Footer;
