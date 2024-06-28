import { raw } from "body-parser";
import { where } from "sequelize";

const db = require("../models");
const createCategoryService = async (cate) => {
  try {
    let data = await db.category.create({
      category: cate.category,
      parentId: cate.parentId,
    });
    data = data.get({ plain: true });
    if (data) {
      return {
        DT: "SUCCESS",
        info: data,
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const listCatgoryService = async () => {
  let data = await db.category.findAll({
    attributes: ["id", "category", "parentId"],
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
    parentId: up.parentId,
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

const get_Parent_Category = async (id) => {
  try {
    let info;
    let arr = [];

    info = await db.category.findOne({
      where: { id: id },
      raw: true,
    });
    arr.push(info?.category);

    if (info && info.parentId) {
      do {
        // check xem có thể loại cha hay không
        let d = await db.category.findOne({
          where: { id: info.parentId },
          raw: true,
        });

        arr.push(d.category);
        info = d;
      } while (info?.parentId);
    }

    
    return {
      EC: 1,
      DT: arr,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default {
  createCategoryService,
  listCatgoryService,
  delete_category,
  update_category,
  get_Parent_Category,
};
