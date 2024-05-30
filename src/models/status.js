"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class status extends Model {
    static associate(models) {
      status.hasMany(models.order, {
        foreignKey: "idStatus",
      });
    }
  }
  status.init(
    {
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "status",
    }
  );
  return status;
};
