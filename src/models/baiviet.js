"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class baiviet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  baiviet.init(
    {
      tieude: DataTypes.STRING,
      key_word: DataTypes.STRING,
      meta_des: DataTypes.STRING,
      mota_ngan: DataTypes.STRING,
      noidung: DataTypes.TEXT,
      thumbnail: DataTypes.STRING,

      slug: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "baiviet",
    }
  );
  return baiviet;
};
