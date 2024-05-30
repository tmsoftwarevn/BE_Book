"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    static associate(models) {
      book.belongsTo(models.category, {
        foreignKey: "idCategory",
      });
      book.hasMany(models.orderDetail, {
        foreignKey: "idBook",
      });
    }
  }
  book.init(
    {
      author: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      slider: DataTypes.JSON,
      mainText: DataTypes.STRING,
      price: DataTypes.INTEGER,
      sold: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      rate: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      idCategory: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "book",
    }
  );
  return book;
};
