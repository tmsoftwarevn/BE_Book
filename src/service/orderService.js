const db = require("../models");
const createOrderService = async (order) => {
  let c = await db.order.create({
    totalProduct: order.totalProduct,
    payment: order.payment,
    total: order.total,
    idUser: order.idUser,
    idStatus: order.idStatus,
    fullname: order.fullname,
    phone: order.phone,
    address: order.address,
  });
  c = c.get({ plain: true });
  if (c) {
    return {
      DT: c,
    };
  }
};

const getOrderHistoryUser = async (idUser, page, limit) => {
  page = +page;
  limit = +limit;
  let total = await db.order.count({
    include: [
      {
        model: db.user,
        where: { id: idUser },
        attributes: [],
      },
      {
        model: db.status,
        attributes: [],
      },
    ],
  });
  let list = await db.order.findAll({
    offset: (page - 1) * limit,
    limit: limit,
    order: [["createdAt", "DESC"]],
    attributes: [
      "totalProduct",
      "payment",
      "total",
      "id",
      "createdAt",
      "status.status",
      "address",
      "phone",
      "fullname",
    ],
    include: [
      {
        model: db.user,
        where: { id: idUser },
        attributes: [],
      },
      {
        model: db.status,
        attributes: [],
      },
    ],
    raw: true,
  });
  if (list) {
    return { list, total };
  }
};

const getOrderAdminService = async (page, limit, search) => {
  page = +page;
  limit = +limit;
  let total = await db.order.count({
    include: {
      model: db.status,
      where: search ? { id: search } : "",
      attributes: [],
    },
  });
  let list = await db.order.findAll({
    order: [["createdAt", "DESC"]],
    attributes: [
      "totalProduct",
      "payment",
      "total",
      "id",
      "createdAt",
      "address",
      "phone",
      "fullname",
      "status.status",
    ],
    include: {
      model: db.status,
      where: search ? { id: search } : "",
      attributes: [],
    },
    raw: true,
  });
  if (list) {
    return { list, total };
  }
};

const updateOrderStatusService = async (Order, Status) => {
  try {
    let values = {
      idStatus: +Status,
    };
    let selector = {
      where: { id: +Order },
    };
    let a = await db.order.update(values, selector);
    if (a) {
      return {
        DT: "update success",
      };
    }
  } catch (error) {}
};
const getOrderStatus1 = async (idUser, idStatus, page, limit) => {
  page = +page;
  limit = +limit;
  let total = await db.order.count({
    include: [
      {
        model: db.user,
        where: { id: idUser },
        attributes: [],
      },
      {
        model: db.status,
        where: { id: +idStatus },
        attributes: [],
      },
    ],
  });
  let list = await db.order.findAll({
    offset: (page - 1) * limit,
    limit: limit,
    order: [["createdAt", "DESC"]],
    attributes: [
      "totalProduct",
      "payment",
      "total",
      "id",
      "createdAt",
      "status.status",
      "address",
      "phone",
      "fullname",
    ],
    include: [
      {
        model: db.user,
        where: { id: idUser },
        attributes: [],
      },
      {
        model: db.status,
        where: { id: +idStatus },
        attributes: [],
      },
    ],
    raw: true,
  });
  if (list) {
    return { list, total };
  }
};
export default {
  createOrderService,
  getOrderHistoryUser,
  getOrderAdminService,
  updateOrderStatusService,
  getOrderStatus1,
};
