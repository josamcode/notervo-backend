const { v2: cloudinary } = require("cloudinary");

const CLOUDINARY_FOLDER = "notervo/products";

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (!hasCloudinaryConfig) {
  console.warn(
    "Cloudinary is not fully configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadImageBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    if (!hasCloudinaryConfig) {
      return reject(
        new Error("Cloudinary environment variables are missing or invalid.")
      );
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

function extractPublicIdFromCloudinaryUrl(imageUrl) {
  try {
    if (typeof imageUrl !== "string" || !imageUrl.startsWith("http")) {
      return null;
    }

    const parsed = new URL(imageUrl);
    if (!parsed.hostname.includes("res.cloudinary.com")) {
      return null;
    }

    const [, uploadSegment] = parsed.pathname.split("/upload/");
    if (!uploadSegment) {
      return null;
    }

    const segments = uploadSegment.split("/").filter(Boolean);
    const versionIndex = segments.findIndex((segment) =>
      /^v\d+$/.test(segment)
    );

    const publicIdSegments =
      versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments;
    if (publicIdSegments.length === 0) return null;

    const lastIndex = publicIdSegments.length - 1;
    publicIdSegments[lastIndex] = publicIdSegments[lastIndex].replace(
      /\.[^.]+$/,
      ""
    );

    return decodeURIComponent(publicIdSegments.join("/"));
  } catch (error) {
    return null;
  }
}

async function deleteCloudinaryImageByUrl(imageUrl) {
  const publicId = extractPublicIdFromCloudinaryUrl(imageUrl);
  if (!publicId) {
    return { skipped: true };
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  return {
    publicId,
    result: result?.result,
    deleted: result?.result === "ok",
    notFound: result?.result === "not found",
  };
}

module.exports = {
  uploadImageBuffer,
  deleteCloudinaryImageByUrl,
};
