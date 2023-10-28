import toast from 'react-hot-toast';

const Toast = (type: 'error' | 'success', message: string) => {
  switch (type) {
    case 'error':
      return toast.error(message, {});
    case 'success':
      return toast.success(message, {});
    default:
      return;
  }
};

export default Toast;
