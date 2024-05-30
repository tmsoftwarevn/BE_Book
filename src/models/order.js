"use strict";
import { v4 as uuidv4 } from "uuid";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    static associate(models) {
      order.belongsTo(models.user, {
        foreignKey: "idUser",
      });
      order.hasMany(models.orderDetail, {
        foreignKey: "idOrder",
      });
      order.belongsTo(models.status, {
        foreignKey: "idStatus",
      });
    }
  }
  order.init(
    {
      totalProduct: DataTypes.INTEGER,
      payment: DataTypes.STRING,
      total: DataTypes.INTEGER,
      idUser: DataTypes.INTEGER,
      idStatus: DataTypes.INTEGER,
      fullname: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "order",
    }
  );
  return order;
};
