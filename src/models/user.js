"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasMany(models.order);
      user.hasMany(models.infoDelivery, {
        foreignKey: "idUser",
      });
    }
  }
  user.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      type: {
        type: DataTypes.STRING,
        defaultValue: "NORMAL",
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "USER",
      },
      OTP: DataTypes.INTEGER,
      refreshToken: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "user",
    }
  );

  return user;
};
