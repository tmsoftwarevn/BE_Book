import { literal, where } from "sequelize";
import { convertSlug } from "../util/convertSlug";

const db = require("../models");
const createHomeService = async (data) => {
  try {
    let d = await db.home.create({
      banner: data.banner,
      gioi_thieu: data.description,
      is_banner: data.is_banner,
    });
    d = d.get({ plain: true });
    if (d) {
      return {
        DT: "SUCCESS",
        info: d,
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const listHomeService = async () => {
  try {
    let data = await db.home.findAll({
     order: [["createdAt", "desc"]],
      raw: true,
    });
    if (data) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

const delete_home = async (id) => {
  try {
    let find = await db.home.findOne({
      where: { id: id },
    });

    if (find) {
      let d = await db.home.destroy({
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

const update_Home = async (id, data) => {

  try {
    let values = {
      banner: data.banner,
      gioi_thieu: data.description,
      is_banner: data.is_banner,
      
    };

    let selector = {
      where: { id: id },
    };
    let find = await db.home.findOne({
      where: { id: id },
    });
    if (find) {
      let u = await db.home.update(values, selector);
      return {
        DT: u,
      };
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

const get_gioithieu = async () => {
  try {
    let data = await db.home.findOne({
      where: { is_banner: 0 },
      raw: true,
    });
    if (data) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export default {
  createHomeService,
  listHomeService,
  delete_home,
  update_Home,
  get_gioithieu
};
