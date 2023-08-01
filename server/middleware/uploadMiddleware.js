const multer = require("multer");
const path = require("path");

// Создаем хранилище (Storage) для файлов медиа (фото и видео)
const mediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Путь для сохранения файлов медиа (папка "uploads/userId/media")
    const mediaDirectory = path.join("uploads", `${req.user.id}`, "media");
    cb(null, mediaDirectory);
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла медиа, чтобы избежать перезаписи файлов
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// Создаем хранилище (Storage) для аватаров
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Путь для сохранения аватаров (папка "uploads/userId/avatars")
    const avatarDirectory = path.join("uploads", `${req.user.id}`, "avatars");
    cb(null, avatarDirectory);
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла аватара, чтобы избежать перезаписи файлов
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// Определяем опции загрузки для видео (только один файл)
const videoUpload = multer({
  storage: mediaStorage,
  limits: {
    fileSize: 1024 * 1024 * 100, // Максимальный размер файла видео (в данном примере - 100 МБ)
    files: 1, // Ограничиваем количество загружаемых файлов до 1
  },
  fileFilter: function (req, file, cb) {
    // Проверяем тип файла видео
    if (file.mimetype.startsWith("video")) {
      cb(null, true);
    } else {
      cb(new Error("Only videos are allowed"));
    }
  },
}).single("media");

// Определяем опции загрузки для изображений (до 5 файлов)
const imageUpload = multer({
  storage: mediaStorage,
  limits: {
    fileSize: 1024 * 1024 * 10, // Максимальный размер файла изображения (в данном примере - 10 МБ)
    files: 5, // Ограничиваем количество загружаемых файлов до 5
  },
  fileFilter: function (req, file, cb) {
    // Проверяем тип файла изображения
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
}).array("media", 5); // "array" указывает на то, что принимаем массив изображений (до 5)

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

module.exports = { imageUpload, videoUpload, avatarUpload };
