const db = require("../models");
import { Op } from "sequelize";
import { sequelize } from "../models/index";

const insertBaiviet = async (data) => {
  try {
    let c = await db.baiviet.create({
      tieude: data.tieude,
      key_word: data.key_word,
      meta_des: data.meta_des,
      mota_ngan: data.mota_ngan,
      noidung: data.noidung,
      thumbnail: data.thumbnail,
      slug: data.slug,
    });
    c = c.get({ plain: true });
    return c;
  } catch (error) {
    console.log(error);
  }
};

const get_detail_baiviet = async (slug) => {
  try {
    console.log('ssss', slug)
    let g = await db.baiviet.findOne({
      where: { slug: slug },
      raw: true,
    });

    return g;
  } catch (error) {
    console.log(error);
  }
};

const get_all_baiviet_paginate = async (page, limit) => {
  try {
    page = +page;
    limit = +limit;
    let total = await db.baiviet.count({
      where: {
       
      },
    });
    let list = await db.baiviet.findAll({
      offset: (page - 1) * limit,
      limit: limit,

      order: [["createdAt", "desc"]],

      raw: true,
    });

    return {list, total}
  } catch (error) {
    console.log(error);
  }
};

const updateBaiviet = async (data, id) => {
  try {
    let u = await db.baiviet.update(
      {
        tieude: data.tieude,
        key_word: data.key_word,
        meta_des: data.meta_des,
        mota_ngan: data.mota_ngan,
        noidung: data.noidung,
        thumbnail: data.thumbnail,

        slug: data.slug,
      },
      {
        where: { id: id },
      }
    );
    if (u[0] > 0)
      return {
        DT: "update success",
      };
  } catch (error) {
    console.log(error);
  }
};

const deleteBaiviet = async (id) => {
  try {
    let del = await db.baiviet.destroy({
      where: { id: id },
    });

    if (del) return { DT: "Delete success" };
  } catch (error) {
    console.log(error);
  }
};

const get_all_baiviet = async () => {
  try {
    let g = await db.baiviet.findAll({
      order: [["createdAt", "desc"]],

      raw: true,
    });

    return g;
  } catch (error) {
    console.log(error);
  }
};

const get_baiviet_trangchu = async (req, res) => {
  try {
    let a = await db.baiviet.findAll({
      order: [["createdAt", "asc"]], ///desc: update mới nhất lên đầu, theo ngày
      limit: 5, // 5 bai mới nhất
      raw: true,
    });
    return a;
  } catch (error) {
    console.log(error);
  }
};

const search_baiviet = async (string, page, limit) => {
  page = +page;
  limit = +limit;
  try {
    let count = await db.baiviet.findAll({
      where: {
        tieude: { [Op.like]: `%${string}%` },
      },
      raw: true,
    });

    let s = await db.baiviet.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      where: {
        tieude: { [Op.like]: `%${string}%` },
      },
      raw: true,
    });
    return {
      total: count.length,
      list: s,
    };
  } catch (error) {
    console.log(error);
  }
};

export default {
  insertBaiviet,
  get_all_baiviet_paginate,
  get_detail_baiviet,
  updateBaiviet,
  deleteBaiviet,
  get_all_baiviet,
  get_baiviet_trangchu,
  search_baiviet,
};
