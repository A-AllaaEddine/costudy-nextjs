export const Fetcher = async (url, options) => {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, 20000);

  return await fetch(url, { ...options, signal: controller.signal });
};
