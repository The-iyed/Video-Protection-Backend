import cloudinary from 'cloudinary';
//@ts-ignore
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUserConfig = (userId: string) => {
  const userConfig = {
    public_id: `${Date.now() + '-' + userId}`,
    secure: true,
    width: process.env.WIDTH_USER_PROFILE,
    height: process.env.HEIGHT_USER_PROFILE,
    format: process.env.FORMAT_USER_PROFILE,
    quality: process.env.QUALITY_USER_PROFILE,
    tags: process.env.CLOUDINARY_TAGS_USER,
    folder: process.env.CLOUDINARY_FOLDER_IMAGE_USER,
  };
  return userConfig;
};

export default cloudinary;
