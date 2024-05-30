"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class infoDelivery extends Model {
    static associate(models) {
      infoDelivery.belongsTo(models.user, {
        foreignKey: "idUser",
      });
    }
  }
  infoDelivery.init(
    {
      fullname: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      idUser: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "infoDelivery",
    }
  );
  return infoDelivery;
};
