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
export default { createCategoryService, listCatgoryService };
