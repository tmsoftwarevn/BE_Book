import { Op } from "sequelize";
import { convertSlug } from "../util/convertSlug";
import { raw } from "body-parser";
//import { Sequelize, sequelize } from "../models/index";
// const Sequelize = require("../models/index");
const { sequelize } = require("../models/index");
const db = require("../models");

const createBookService = async (book) => {
  let slug = convertSlug(book.mainText);
  let info = await db.book.create({
    author: book.author,
    thumbnail: book.thumbnail,
    slider: book.slider,
    mainText: book.mainText,
    price: book.price,
    sold: book.sold,
    quantity: book.quantity,
    rate: book.rate,
    idCategory: book.idCategory,
    slug: slug,
    description: book.description,
    hinhthuc: book.hinhthuc,
    nhaxuatban: book.nhaxuatban,
    ngayxuatban: book.ngayxuatban,
  });
  info = info.get({ plain: true });

  if (info) {
    return {
      DT: "SUCCESS",
      info: info,
    };
  }
};

const getInfoBookService = async (idBook) => {
  let num = Number(idBook); // check neu la so or slug
  if (num) {
    let inf = await db.book.findOne({
      where: { id: idBook },
      attributes: [
        "id",
        "author",
        "thumbnail",
        "slider",
        "mainText",
        "price",
        "sold",
        "quantity",
        "rate",
        "slug",
        "description",
        "hinhthuc",
        "ngayxuatban",
        "nhaxuatban",
        "category.category",
        "createdAt",
        "updatedAt",
      ],
      include: {
        model: db.category,
        attributes: [],
      },
      raw: true,
    });
    if (inf) {
      return {
        DT: "SUCCESS",
        inf: inf,
      };
    }
  } else {
    let inf = await db.book.findOne({
      where: { slug: idBook },
      attributes: [
        "id",
        "author",
        "thumbnail",
        "slider",
        "mainText",
        "price",
        "sold",
        "quantity",
        "rate",
        "description",
        "hinhthuc",
        "ngayxuatban",
        "nhaxuatban",
        "slug",
        "category.category",
        "createdAt",
        "updatedAt",
      ],
      include: {
        model: db.category,
        attributes: [],
      },
      raw: true,
    });
    if (inf) {
      return {
        DT: "SUCCESS",
        inf: inf,
      };
    }
  }
};

const deleteBookService = async (id) => {
  let del = db.book.destroy({
    where: { id: id },
  });
  if (del) {
    return {
      DT: "delete success",
    };
  } else {
    return {
      message: "Some thing Wrong",
    };
  }
};
const updateBookService = async (id, up) => {
  let slug = convertSlug(up.mainText);

  let values = {
    author: up.author,
    thumbnail: up.thumbnail,
    slider: up.slider,
    mainText: up.mainText,
    slug: slug,
    price: up.price,
    description: up.description,
    quantity: up.quantity,
    idCategory: up.idCategory,
    hinhthuc: up.hinhthuc,
    nhaxuatban: up.nhaxuatban,
    ngayxuatban: up.ngayxuatban,
  };

  let selector = {
    where: { id: id },
  };
  let find = await db.book.findOne({
    where: { id: id },
  });
  if (find) {
    let a = await db.book.update(values, selector);
    return {
      DT: a,
    };
  } else {
    return null;
  }
};

const getListBookService = async (
  page,
  limit,
  field,
  sort,
  mainText,
  price,
  category
) => {
  page = +page;
  limit = +limit;
  try {
    let total = await db.book.count({
      where: {
        [Op.and]: [
          {
            mainText: {
              [Op.like]: mainText ? "%" + mainText + "%" : "%%",
            },
          },
          {
            price: {
              [Op.gt]: price ? +price : 0,
            },
          },
        ],
      },
      include: {
        where: category ? { id: category } : "",
        model: db.category,
        attributes: [],
      },
    });
    //----------------------------------------
    let list = await db.book.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      order: [[field, sort]],
      where: {
        [Op.and]: [
          {
            mainText: {
              [Op.like]: mainText ? `%${mainText}%` : "%%",
            },
          },
          {
            price: {
              [Op.gt]: price ? +price : 0,
            },
          },
        ],
      },

      attributes: [
        "id",
        "author",
        "thumbnail",
        "slider",
        "mainText",
        "slug",
        "price",
        "sold",
        "description",
        "hinhthuc",
        "ngayxuatban",
        "nhaxuatban",
        "quantity",
        "rate",
        "category.category",
        "createdAt",
        "updatedAt",
      ],
      include: {
        where: category ? { id: category } : "",
        model: db.category,
        attributes: [],
      },
      raw: true,
    });
    return { list, total };
  } catch (error) {
    console.log(error);
  }
};

const getListBookHomeService = async (
  page,
  limit,
  category,
  field,
  sort,
  rate,
  price
) => {
  page = +page;
  limit = +limit;
  let array = JSON.parse("[" + category + "]");
  let arrPrice = JSON.parse("[" + price + "]");

  try {
    let total = await db.book.count({
      where: {
        [Op.and]: [
          {
            rate: {
              [Op.gte]: rate ? +rate : 0,
            },
          },
          {
            price: {
              [Op.between]: price ? arrPrice : [0, 99999999],
            },
          },
        ],
      },
      include: {
        model: db.category,
        where: category
          ? {
              id: array,
            }
          : "",
        attributes: [],
      },
    });
    let list = await db.book.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      order: field ? [[field, sort]] : [],
      attributes: [
        "id",
        "author",
        "thumbnail",
        "slider",
        "mainText",
        "slug",
        "price",
        "sold",
        "quantity",
        "description",
        "hinhthuc",
        "ngayxuatban",
        "nhaxuatban",
        "rate",
        "category.category",
        "createdAt",
        "updatedAt",
      ],
      where: {
        [Op.and]: [
          {
            rate: {
              [Op.gte]: rate ? +rate : 0,
            },
          },
          {
            price: {
              [Op.between]: price ? arrPrice : [0, 99999999],
            },
          },
        ],
      },
      include: {
        model: db.category,
        where: category
          ? {
              id: array,
            }
          : "",
        attributes: [],
      },
      raw: true,
    });
    return { list, total };
  } catch (error) {
    console.log(error);
  }
};

const updateBookAfterOrder = async (bookId, count) => {
  const selector = {
    where: { id: bookId },
  };
  const values = {
    sold: sequelize.literal(`sold + ${count}`),
    quantity: sequelize.literal(`quantity - ${count}`),
  };

  let u = await db.book.update(values, selector);
  if (u) {
    return {
      DT: u,
    };
  }
};

const listBookPopulateServiceAll = async () => {
  let d = await db.book.findAll({
    limit: 10, // tìm 8 cuốn phổ biến , theo nhiều người mua nhất // chỉnh lại là sách mới
    order: [["createdAt", "DESC"]],
  });
  if (d) {
    return {
      DT: d,
    };
  }
};

const searchBookService = async (mainText, page, limit) => {
  page = +page;
  limit = +limit;
  try {
    let total = await db.book.count({
      where: {
        mainText: {
          [Op.like]: mainText ? "%" + mainText + "%" : "%%",
        },
      },
    });
    let list = await db.book.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      attributes: [
        "id",
        "author",
        "thumbnail",
        "slider",
        "mainText",
        "slug",
        "price",
        "description",
        "hinhthuc",
        "ngayxuatban",
        "nhaxuatban",
        "sold",
        "quantity",
        "rate",
        "category.category",
        "createdAt",
        "updatedAt",
      ],
      where: {
        mainText: {
          [Op.regexp]: mainText,
        },
      },
      include: {
        model: db.category,
        attributes: [],
      },
      raw: true,
    });
    if (list.length === 0) {
      list = await db.book.findAll({
        offset: (page - 1) * limit,
        limit: limit,
        attributes: [
          "id",
          "author",
          "thumbnail",
          "slider",
          "mainText",
          "slug",
          "price",
          "description",
          "hinhthuc",
          "ngayxuatban",
          "nhaxuatban",
          "sold",
          "quantity",
          "rate",
          "category.category",
          "createdAt",
          "updatedAt",
        ],
        where: {
          mainText: {
            [Op.like]: mainText ? "%" + mainText + "%" : "%%",
          },
        },
        include: {
          model: db.category,
          attributes: [],
        },
        raw: true,
      });
    }
    return { list, total };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const get_list_from_idParent = async (arrId) => {
   console.log('arrr string', arrId)
  try {
    //const arr = JSON.parse(arrId);
    //console.log('ar', arr)
    let data = await db.book.findAll({
      limit: 10,
      where: { idCategory: arrId },
      raw: true,
    });
 
    return data;
    
  } catch (error) {
    console.log(error);
  }
};

export default {
  createBookService,
  getInfoBookService,
  getListBookService,
  deleteBookService,
  updateBookService,
  getListBookHomeService,
  updateBookAfterOrder,
  listBookPopulateServiceAll,
  searchBookService,
  get_list_from_idParent,
};
