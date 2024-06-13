import { where } from "sequelize";

const db = require("../models");
const createCategoryService = async (cate) => {
  let data = await db.category.create({
    category: cate,
  });
  data = data.get({ plain: true });
  if (data) {
    return {
      DT: "SUCCESS",
      info: data,
    };
  }
};

const listCatgoryService = async () => {
  let data = await db.category.findAll({
    attributes: ["id", "category"],
    raw: true,
  });
  if (data) {
    return data;
  }
};

const delete_category = async (id) => {
  try {
    let find = await db.category.findOne({
      where: { id: id },
    });

    if (find) {
      let d = await db.category.destroy({
        where: { id: id },
      });
      if (d) {
        return {
          EC: 1,
        };
      }
    }

    return null;
  } catch (error) {
    console.log(error);
  }
};

const update_category = async (id, up) => {
  let values = {
    category: up.category,
  };
  let selector = {
    where: { id: id },
  };
  let find = await db.category.findOne({
    where: { id: id },
  });
  if (find) {
    let u = await db.category.update(values, selector);
    return {
      DT: u,
    };
  } else {
    return null;
  }
};

export default { createCategoryService, listCatgoryService, delete_category, update_category };
