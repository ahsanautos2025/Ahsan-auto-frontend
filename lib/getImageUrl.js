export const getImageUrl = (relativePath) => {
  if (!relativePath) return "/placeholder.svg";
  return `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${relativePath}`;
};