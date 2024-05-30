const db = require("../models");
const createDeliveryService = async (delivery) => {
  let c = await db.infoDelivery.create({
    fullname: delivery.fullname,
    phone: delivery.phone,
    address: delivery.address,
    idUser: delivery.idUser,
  });
  c = c.get({ plain: true });
  if (c) {
    return {
      DT: c,
    };
  }
};

const getInfoDeliveryService = async (id) => {
  let g = await db.infoDelivery.findAll({
    attributes: ["fullname", "phone", "address", "id"],
    include: {
      model: db.user,
      where: { id: id },
      attributes: [],
    },
    raw: true,
  });
  if (g) {
    return {
      DT: g,
    };
  }
};
const updateDeliveryService = async (id, up) => {
  let values = {
    fullname: up.fullname,
    phone: up.phone,
    address: up.address,
  };
  let selector = {
    where: { id: id },
  };
  let find = await db.infoDelivery.findOne({
    where: { id: id },
  });
  if (find) {
    let a = await db.infoDelivery.update(values, selector);
    return {
      DT: a,
    };
  } else {
    return null;
  }
};
export default {
  createDeliveryService,
  getInfoDeliveryService,
  updateDeliveryService,
};
