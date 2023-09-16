export const Fetcher = async (url: string, options: any) => {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, 20000);

  return await fetch(url, { ...options, signal: controller.signal });
};
