"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orderDetail extends Model {
    static associate(models) {
      orderDetail.belongsTo(models.order, {
        foreignKey: "idOrder",
      });
      orderDetail.belongsTo(models.book, {
        foreignKey: "idBook",
      });
    }
  }
  orderDetail.init(
    {
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      idOrder: DataTypes.INTEGER,
      idBook: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "orderDetail",
    }
  );

  return orderDetail;
};
