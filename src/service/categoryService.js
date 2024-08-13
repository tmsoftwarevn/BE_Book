import { raw } from "body-parser";
import { literal, where } from "sequelize";
import { convertSlug } from "../util/convertSlug";

const db = require("../models");
const createCategoryService = async (cate) => {
  try {
    let slug = convertSlug(cate.category);
    let data = await db.category.create({
      category: cate.category,
      parentId: cate.parentId,
      slug: slug,
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
    // attributes: ["id", "category", "parentId", "slug"],
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
  try {
  
    let slug = convertSlug(up.category);
    let values = {
      category: up.category,
      parentId: up.parentId,
      slug: slug,
      active: up.active,
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
  } catch (error) {
    console.log(error);
  }
};

// custom admin " / /"
const get_Parent_Category = async (id) => {
  try {
    let info;
    let arr = [];
    // tìm cha id parent
    info = await db.category.findOne({
      where: { id: id },
      raw: true,
    });
    arr.push(info);

    if (info && info.parentId) {
      do {
        // check xem có thể loại cha hay không
        let d = await db.category.findOne({
          where: { id: info.parentId },
          raw: true,
        });

        arr.push(d);
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

const get_category_parent_home = async () => {
  try {
    let list = await db.category.findAll({
      attributes: {
        include: [
          [literal("CAST(id AS CHAR)"), "key"], // Alias 'id' to 'key'
          ["category", "label"], // Alias 'category' to 'label'
          "parentId",
          "slug",
        ],
      },
      raw: true,
    });

    let custom = getNestedChildren(list, 0);
    return {
      EC: 1,
      data: custom,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
const getNestedChildren = (arr, parentId) => {
  var out = [];
  for (var i in arr) {
    if (arr[i].parentId == parentId) {
      var children = getNestedChildren(arr, arr[i].id);

      if (children.length) {
        arr[i].children = children;
      }
      out.push(arr[i]);
    }
  }
  return out;
};

export default {
  createCategoryService,
  listCatgoryService,
  delete_category,
  update_category,
  get_Parent_Category,
  get_category_parent_home,
};
