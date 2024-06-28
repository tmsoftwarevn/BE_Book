//import db from "../models";
import categoryService from "../service/categoryService";

const postCreateCategory = async (req, res) => {
  let data = await categoryService.createCategoryService(req.body);
  if (data && data.info) {
    return res.status(200).json({
      EC: 1,
      data: data.info,
    });
  } else {
    return res.status(400).json({
      message: "Create failed",
    });
  }
};

const getListCategory = async (req, res) => {
  let data = await categoryService.listCatgoryService();
  if (data) {
    return res.status(200).json({
      EC: 1,
      data: data,
    });
  } else {
    return res.status(500).json({
      message: "Some thing wrong",
    });
  }
};

const delete_category = async (req, res) => {
  try {
    let data = await categoryService.delete_category(req.params.id);
    if (data && data.EC) {
      return res.status(200).json({
        EC: 1,
        data: "Xóa thành công",
      });
    } else {
      return res.status(400).json({
        EC: -1,
        data: "Xóa thất bại",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      EC: -1,
      data: "Lỗi server",
    });
  }
};

const update_category = async (req, res) => {
  try {
    let data = await categoryService.update_category(req.params.id, req.body);
    if (data && data.DT) {
      return res.status(200).json({
        EC: 1,
        data: data.DT,
      });
    } else {
      return res.status(400).json({
        EC: -1,
        message: "có lỗi",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Some thing wrong",
    });
  }
};

const get_Parent_Category = async (req, res) => {
  try {
    let data = await categoryService.get_Parent_Category(req.params.id);
    if (data && data.EC === 1) {
      return res.status(200).json({
        EC: 1,
        data: data.DT,
      });
    }

    return res.status(400).json({
      EC: -1,
      message: "Something wrongs",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      message: "Some thing wrong",
    });
  }
};

export default {
  postCreateCategory,
  getListCategory,
  delete_category,
  update_category,
  get_Parent_Category
};
