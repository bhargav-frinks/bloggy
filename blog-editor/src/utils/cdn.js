const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;

export const getCDNUrl = (type, fileName) => {

  console.log({ CDN_BASE_URL, type, fileName });
  return `${CDN_BASE_URL}${type}/${fileName}`;
};
