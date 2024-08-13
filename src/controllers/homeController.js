//import db from "../models";
import HomeService from "../service/HomeService";

const postCreateHome = async (req, res) => {
  let data = await HomeService.createHomeService(req.body);
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

const getListHome = async (req, res) => {
  let data = await HomeService.listHomeService();
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

const delete_Home = async (req, res) => {
  try {
    let data = await HomeService.delete_home(req.params.id);
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

const update_Home = async (req, res) => {
  try {
    let data = await HomeService.update_Home(req.params.id, req.body);
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

export default {
  postCreateHome,
  getListHome,
  delete_Home,
  update_Home,
};
