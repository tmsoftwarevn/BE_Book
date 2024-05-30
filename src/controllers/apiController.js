import userService from "../service/userService";
import jwtService from "../service/jwtService";
import checkMiddleware from "../middleware/checkMiddleware";
require("dotenv").config();

const postLogout = async (req, res) => {
  try {
    await jwtService.deleteRefreshToken(req.body.id);
    res.clearCookie("refreshToken", {
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
    });
    return res.status(200).json({
      EC: 1,
      data: "Logout success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      message: "Some thing wrong server",
    });
  }
};
const postLogin = async (req, res) => {
  try {
    let data = await userService.loginUserService(req.body);
    if (data && data.user) {
      let access_token = checkMiddleware.createJWT(data.user);
      let refresh_token = checkMiddleware.createJWTRefresh(data.user);
      await jwtService.saveRefreshToken(data.user, refresh_token);

      res.cookie("refreshToken", refresh_token, {
        maxAge: parseInt(process.env.MAX_AGE_REFRESH_TOKEN),
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
        secure: true,
        path: "/",
      });

      return res.status(200).json({
        data: data.user,
        access_token: access_token,
        EC: 1,
      });
    }
    return res.status(400).json({
      EC: -1,
      message: data.message,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      message: ["Some thing wrong server"],
    });
  }
};
const postRegisterUser = async (req, res) => {
  try {
    let data = await userService.registerUserService(req.body);
    if (data && data.user) {
      return res.status(201).json({
        data: data,
        EC: 1,
      });
    } else {
      return res.status(400).json({
        message: data.message,
        EC: -1,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Wrong somthing at server",
      EC: -1,
    });
  }
};

const getUserAdress = async (req, res) => {
  try {
    let data = await jwtService.getInfoDelivery();
    if (data) {
      return res.status(200).json({
        data: data,
        EC: 1,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Some thing wrong server",
      EC: -1,
    });
  }
};

const getListUser = async (req, res) => {
  try {
    let { current, pageSize, field, sort, searchName, searchEmail } = req.query;

    let data = await userService.getListUserService(
      current,
      pageSize,
      field,
      sort,
      searchName,
      searchEmail
    );
    if (data) {
      return res.status(200).json({
        data: {
          EC: 1,
          meta: {
            current: current,
            pageSize: pageSize,
            pages: Math.ceil(+data.total / +pageSize),
            total: data.total,
          },
          result: data.list,
        },
      });
    } else {
      return res.status(500).json({
        message: "Something wrong in server",
        EC: -1,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something wrong in server",
      EC: -1,
    });
  }
};

const delelteUser = async (req, res) => {
  let data = await userService.deleteUserService(req.params.id);
  if (data && data.DT) {
    return res.status(200).json({
      data: "Delete success",
      EC: 1,
    });
  } else {
    return res.status(400).json({
      message: "wwrong some thing",
    });
  }
};
/// change name
const putUser = async (req, res) => {
  let data = await userService.updateUserSerice(
    req.params.id,
    req.body.fullname
  );
  if (data && data.DT) {
    return res.status(200).json({
      data: "Update success",
    });
  } else {
    return res.status(400).json({
      message: data.message,
    });
  }
};
const putPasswordUser = async (req, res) => {
  let data = await userService.updatePasswordUser(
    req.body.email,
    req.body.newPassword
  );
  if (data && data.DT) {
    return res.status(200).json({
      data: "Update success",
    });
  } else {
    return res.status(400).json({
      message: data.message,
    });
  }
};
const checkPass = async (req, res, next) => {
  let check = await userService.checkPasswordService(
    req.body.email,
    req.body.password
  );
  if (check === true) {
    return next();
  } else {
    return res.status(400).json({
      message: "Mật khẩu không chính xác",
    });
  }
};
export default {
  postLogin,
  postLogout,
  postRegisterUser,
  getUserAdress,
  getListUser,
  delelteUser,
  putUser,
  putPasswordUser,
  checkPass,
};
