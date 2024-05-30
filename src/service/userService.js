import { Op, where } from "sequelize";
//import db from "../models/index";
const db = require("../models");
import jwtService from "./jwtService";
import bcrypt from "bcryptjs";

const valiateDataLogin = (rawData) => {
  try {
    if (!rawData.email || !rawData.password) return false;
    return true;
  } catch (error) {
    console.log(error);
  }
};
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const loginUserService = async (rawData) => {
  try {
    if (valiateDataLogin(rawData) === false) {
      return {
        message: ["Chưa nhập mật khẩu hoặc email"],
      };
    }
    if (!validateEmail(rawData.email)) {
      return {
        message: ["Email chưa đúng định dạng"],
      };
    }
    let user = await db.user.findOne({
      where: {
        email: rawData.email,
      },
    });
    if (user) {
      let userData = user.get({ plain: true });
      let isAdmin = false;
      if (userData.email === "admin@gmail.com") {
        if (rawData.password === userData.password) {
          isAdmin = true;
        }
      }
      let isPassword = bcrypt.compareSync(rawData.password, userData.password);
      if (isPassword || isAdmin === true) {
        let infoUser = await jwtService.getInfoUser(userData);
        return {
          user: infoUser,
        };
      }
    }
    return {
      message: "Email hoặc mật khẩu chưa đúng.Hãy kiểm tra lại",
    };
  } catch (error) {
    console.log("error", error);
    return {
      message: "Something wrong from server",
    };
  }
};

const salt = bcrypt.genSaltSync(10);
const hashUserPassword = (userPassword) => {
  let hash = bcrypt.hashSync(userPassword, salt);
  return hash;
};
const checkEmailExist = async (userEmail) => {
  try {
    let user = await db.user.findOne({
      where: { email: userEmail },
    });

    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

const registerUserService = async (rawData) => {
  try {
    if (!rawData.email || !rawData.fullName || !rawData.password) {
      return {
        message: "Chưa nhập đầy đủ thông tin. Hãy kiểm tra lại",
      };
    }
    if ((await checkEmailExist(rawData.email)) === true) {
      return {
        message: "Email đã được đăng kí.Hãy kiểm tra lại",
      };
    }
    if (!validateEmail(rawData.email)) {
      return {
        message: "Email chưa đúng định dạng. Hãy kiểm tra lại",
      };
    }
    let hashPassword = hashUserPassword(rawData.password);
    let newUser = await db.user.create({
      fullName: rawData.fullName,
      email: rawData.email,
      password: hashPassword,
    });
    let info = await jwtService.getInfoUser(newUser);

    return {
      user: info,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Something wrong in server",
    };
  }
};

const getListUserService = async (
  page,
  limit,
  field,
  sort,
  searchName,
  searchEmail
) => {
  try {
    page = +page;
    limit = +limit;
    let total = await db.user.count({
      where: {
        [Op.and]: [
          {
            fullName: {
              [Op.like]: `%${searchName}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${searchEmail}%`,
            },
          },
        ],
      },
    });
    let list = await db.user.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      order: [[field, sort]],
      where: {
        [Op.and]: [
          {
            fullName: {
              [Op.like]: `%${searchName}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${searchEmail}%`,
            },
          },
        ],
      },
      attributes: [
        "fullName",
        "email",
        "type",
        "role",
        "id",
        "createdAt",
        "updatedAt",
      ],
    });
    return { list, total };
  } catch (error) {
    console.log(error);
  }
};

const deleteUserService = async (userId) => {
  try {
    let del = await db.user.destroy({
      where: { id: userId },
    });
    if (del) {
      return {
        DT: "delete success",
      };
    } else {
      return {
        message: "Somw thing Wrong",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: "Some thing wrong",
    };
  }
};

const updateUserSerice = async (id, name) => {
  if (!name)
    return {
      message: "Vui lòng nhập đầy đủ thông tin",
    };
  try {
    let u = await db.user.update(
      {
        fullName: name,
      },
      {
        where: { id: id },
      }
    );
    return {
      DT: "update success",
    };
  } catch (error) {}
};

const updatePasswordUser = async (email, newPass) => {
  try {
    if (!email || !newPass)
      return {
        message: "Vui lòng nhập đầy đủ thông tin",
      };
    let hashPassword = hashUserPassword(newPass);
    let u = await db.user.update(
      { password: hashPassword },
      { where: { email: email } }
    );
    return {
      DT: "update success",
    };
  } catch (error) {
    return {
      message: "Có lỗi xảy ra",
    };
  }
};
const checkPasswordService = async (email, pass) => {
  let user = await db.user.findOne({
    where: {
      email: email,
    },
  });
  if (user) {
    let userData = user.get({ plain: true });
    let isPassword = bcrypt.compareSync(pass, userData.password);
    if (isPassword) {
      return true;
    }
  }
  return false;
};

export default {
  loginUserService,
  registerUserService,
  getListUserService,
  deleteUserService,
  updateUserSerice,
  updatePasswordUser,
  checkPasswordService,
};
