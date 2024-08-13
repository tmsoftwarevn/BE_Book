"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    static associate(models) {
      category.hasMany(models.book, {
        foreignKey: "idCategory",
      });
    }
  }
  category.init(
    {
      category: DataTypes.STRING,
      slug: DataTypes.STRING,
      parentId: DataTypes.INTEGER,
      active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "category",
    }
  );
  return category;
};
