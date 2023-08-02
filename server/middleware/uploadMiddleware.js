const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Создаем хранилище (Storage) для файлов медиа (фото и видео)
const mediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Путь для сохранения файлов медиа (папка "uploads/userId/media")
    const mediaDirectory = path.join(
      "public",
      "uploads",
      `${req.user.id}`,
      "media"
    );

    // Проверяем, существует ли папка
    if (!fs.existsSync(mediaDirectory)) {
      // Если папка не существует, создаем ее
      fs.mkdirSync(mediaDirectory, { recursive: true });
    }

    cb(null, mediaDirectory);
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла медиа, чтобы избежать перезаписи файлов
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Создаем хранилище (Storage) для аватаров
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Путь для сохранения аватаров (папка "uploads/userId/avatars")
    const avatarDirectory = path.join(
      "public",
      "uploads",
      `${req.user.id}`,
      "avatars"
    );

    // Проверяем, существует ли папка
    if (!fs.existsSync(avatarDirectory)) {
      // Если папка не существует, создаем ее
      fs.mkdirSync(avatarDirectory, { recursive: true });
    }

    cb(null, avatarDirectory);
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла аватара, чтобы избежать перезаписи файлов
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Определяем опции загрузки для видео (только один файл)
const mediaUpload = multer({
  storage: mediaStorage,
  limits: {
    fileSize: 1024 * 1024 * 50, // Максимальный размер файла видео (в данном примере - 100 МБ)
    files: 10, // Ограничиваем количество загружаемых файлов до 1
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
    fileSize: 1024 * 1024 * 20, // Максимальный размер файла видео (в данном примере - 100 МБ)
    files: 1, // Ограничиваем количество загружаемых файлов до 1
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
  limits: {
    fileSize: 1024 * 1024 * 5, // Максимальный размер файла аватара (в данном примере - 5 МБ)
  },
  fileFilter: function (req, file, cb) {
    // Проверяем тип файла аватара. В данном примере разрешены только изображения
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed for avatars"));
    }
  },
}).single("avatar");

module.exports = { mediaUpload, avatarUpload, storyUpload };
