const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tempStorage = multer.memoryStorage();

// Загрузка для дальнейшего сжатия(только 1 файл, без ограничений)
const tempUpload = multer({
  storage: tempStorage,
  limits: {
    files: 1,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
}).single("media");

const mediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const mediaDirectory = path.join(
      "public",
      "uploads",
      `${req.user.id}`,
      "media"
    );

    if (!fs.existsSync(mediaDirectory)) {
      fs.mkdirSync(mediaDirectory, { recursive: true });
    }

    cb(null, mediaDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const avatarDirectory = path.join(
      "public",
      "uploads",
      `${req.user.id}`,
      "avatars"
    );

    if (!fs.existsSync(avatarDirectory)) {
      fs.mkdirSync(avatarDirectory, { recursive: true });
    }

    cb(null, avatarDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const mediaUpload = multer({
  storage: mediaStorage,
  limits: {
    files: 10,
  },
  fileFilter: function (req, file, cb) {
    // Проверяем тип файла видео
    if (
      file.mimetype.startsWith("video") ||
      file.mimetype.startsWith("image")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only videos or photos are allowed"));
    }
  },
}).array("media", 10);

const storyUpload = multer({
  storage: mediaStorage,
  limits: {
    files: 1,
  },
  fileFilter: function (req, file, cb) {
    // Проверяем тип файла видео
    if (
      file.mimetype.startsWith("video") ||
      file.mimetype.startsWith("image")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only videos or photos are allowed"));
    }
  },
}).single("content");

// Определяем опции загрузки для аватаров
const avatarUpload = multer({
  storage: avatarStorage,

  fileFilter: function (req, file, cb) {
    // Проверяем тип файла аватара. В данном примере разрешены только изображения
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed for avatars"));
    }
  },
}).single("avatar");

module.exports = { mediaUpload, avatarUpload, storyUpload, tempUpload };
