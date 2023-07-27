const User = require("../models/User");
const VerificationCode = require("../models/VerificationCode");

const clearUsersTable = async () => {
  try {
    await User.destroy({
      where: {},
      truncate: { cascade: true },
    });

    console.log("Users table cleared successfully");
  } catch (error) {
    console.error("Error clearing Users table:", error);
  }
};

const clearVerificationCodesTable = async () => {
  try {
    await VerificationCode.destroy({
      where: {},
      truncate: { cascade: true },
    });

    console.log("VerificationCodes table cleared successfully");
  } catch (error) {
    console.error("Error clearing VerificationCodes table:", error);
  }
};

// Экспортируйте функции, чтобы можно было использовать их в других файлах
module.exports = {
  clearUsersTable,
  clearVerificationCodesTable,
};
