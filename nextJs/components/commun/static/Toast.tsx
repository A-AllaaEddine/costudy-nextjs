import toast from 'react-hot-toast';
import { IoWarningSharp } from 'react-icons/io5';
import { IoMdInformationCircle, IoMdCheckmarkCircle } from 'react-icons/io';

const Toast = (type: string, message: string) => {
  switch (type) {
    case 'warning':
      return toast(message, {
        icon: <IoWarningSharp color="#FF8A20" />,
      });
    case 'error':
      return toast(message, {
        icon: <IoMdInformationCircle color="#ff4336" />,
      });
    case 'success':
      return toast(message, {
        icon: <IoMdCheckmarkCircle color="#50e722" />,
      });
    default:
      return;
  }
};

export default Toast;
