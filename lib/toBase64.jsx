export const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) {
      return reject(new Error('Invalid file provided'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log('Base64 Output:', reader.result.substring(0, 50)); // Log for debugging
      resolve(reader.result);
    };
    reader.onerror = (error) => reject(error);
  });
};