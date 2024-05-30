import { Op } from "sequelize";
//import { Sequelize, sequelize } from "../models/index";
// const Sequelize = require("../models/index");
const { sequelize } = require("../models/index");
const db = require("../models");

const createBookService = async (book) => {
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
  let values = {
    author: up.author,
    thumbnail: up.thumbnail,
    slider: up.slider,
    mainText: up.mainText,
    price: up.price,
    quantity: up.quantity,
    idCategory: up.idCategory,
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
        "price",
        "sold",
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
        "price",
        "sold",
        "quantity",
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
    order: [["sold", "DESC"]],
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
        "price",
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
          "price",
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
};
