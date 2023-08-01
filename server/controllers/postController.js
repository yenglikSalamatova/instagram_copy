const Post = require("../models/Post");
const Media = require("../models/Media");
const mime = require("mime-types");
const path = require("path");
const { videoUpload, imageUpload } = require("../middleware/uploadMiddleware");

// Функция для определения типа медиа на основе URL или MIME-типа
const getMediaTypeFromUrl = (url) => {
  const mimeType = mime.lookup(url);
  console.log("MIME type:", mimeType);

  if (mimeType && mimeType.startsWith("image")) {
    return "photo";
  } else if (mimeType && mimeType.startsWith("video")) {
    return "video";
  } else {
    // Извлекаем расширение файла из URL
    const extension = path.extname(url).toLowerCase();

    // Массив со значениями расширений файлов для фото
    const photoExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    // Массив со значениями расширений файлов для видео
    const videoExtensions = [".mp4", ".avi", ".mov"];

    if (photoExtensions.some((ext) => extension.startsWith(ext))) {
      return "photo";
    } else if (videoExtensions.some((ext) => extension.startsWith(ext))) {
      return "video";
    } else {
      return "unknown"; // или другое значение для неопределенного типа
    }
  }
};

const createPost = async (req, res) => {
  console.log(req.body);

  try {
    // const mediaType = getMediaTypeFromUrl(mediaUrls[0]);
    // const newPost = await Post.create({
    //   caption,
    //   mediaType,
    //   UserId: req.user.id,
    // });
    // console.log(newPost);
    // if (mediaType === "photo") {
    //   // Создаем связанные медиа-файлы
    //   const mediaPromises = mediaUrls.map(async (url) => {
    //     return Media.create({
    //       url,
    //       type: mediaType,
    //       postId: newPost.id,
    //     });
    //   });
    // }
    // await Promise.all(mediaPromises);
    // res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error when creating a post" });
  }
};

module.exports = { createPost };
