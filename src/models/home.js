"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class home extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  home.init(
    {
      banner: DataTypes.STRING,
      gioi_thieu: DataTypes.TEXT,
      is_banner:DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "home",
    }
  );
  return home;
};
