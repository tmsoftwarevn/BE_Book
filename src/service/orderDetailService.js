const db = require("../models");
const createOrderDetail = async (arr) => {
  let c = await db.orderDetail.bulkCreate(arr, {});
  if (c) {
    return {
      DT: c,
    };
  }
};

const getOrderDetailService = async (idOrder) => {
  try {
    let list = await db.orderDetail.findAll({
      attributes: [
        "quantity",
        "price",
        "book.mainText",
        "book.thumbnail",
        "book.id",
      ],
      include: [
        {
          model: db.order,
          where: { id: idOrder },
          attributes: [],
        },
        {
          model: db.book,
          attributes: [],
        },
      ],
      raw: true,
    });
  
    if (list && list.length > 0) {
      return { list };
    }
  } catch (error) {
    console.log(error)
  }
 
};
export default { createOrderDetail, getOrderDetailService };
