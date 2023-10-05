const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Subscription = sequelize.define("Subscription", {
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Increment the followersCount and followingCount of the users involved
Subscription.afterCreate(async (subscription) => {
  if (subscription.followingId == subscription.followerId) {
    return;
  }
  await User.increment("followersCount", {
    by: 1,
    where: { id: subscription.followingId },
  });
  await User.increment("followingCount", {
    by: 1,
    where: { id: subscription.followerId },
  });
  console.log("Subscription created");
});

// Decrement the followersCount and followingCount of the users involved
Subscription.beforeDestroy(async (subscription) => {
  if (subscription.followingId == subscription.followerId) {
    return;
  }
  await User.decrement("followersCount", {
    by: 1,
    where: { id: subscription.followingId },
  });
  await User.decrement("followingCount", {
    by: 1,
    where: { id: subscription.followerId },
  });
  console.log("Subscription destroyed");
});

module.exports = Subscription;
