//import db from "../models/index";
const db = require("../models");
import checkMiddleware from "../middleware/checkMiddleware";
import jwtService from "./jwtService";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
require("dotenv").config();

const createUserSocial = async (drawData, type) => {
  try {
    let check = await db.user.findOne({
      where: { email: drawData.email },
    });
    if (check) check = check.get({ plain: true });
    if (!check) {
      let newUser = await db.user.create({
        fullName: drawData.username,
        email: drawData.email,
        type: type,
      });
      newUser = newUser.get({ plain: true });
      return newUser;
    }
    return check;
  } catch (error) {
    console.log(error);
  }
};

const createAcessTokenSocial = async (req, res) => {
  try {
    console.log("check user login: ", req.user);
    if (req.user) {
      let user = req.user;
      let access_token = checkMiddleware.createJWT(user);
      let refresh_token = checkMiddleware.createJWTRefresh(user);
      await jwtService.saveRefreshToken(user, refresh_token);
      res.cookie("refreshToken", refresh_token, {
        maxAge: parseInt(process.env.MAX_AGE_REFRESH_TOKEN),
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
        secure: true,
        path: "/",
      });
      //req.user = null;
      return res.status(200).json({
        data: user,
        access_token: access_token,
        EC: 1,
      });
    } else {
      return res.status(400).json({
        message: "login failed",
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

const sendCode = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const info = await transporter.sendMail({
      from: `"Windy Book 👻" <${process.env.GOOGLE_APP_EMAIL}>`,
      to: `${email}`,
      subject: "Reset mật khẩu Windy Book",
      html: `
      <b>Bạn nhận được mã OTP để xác nhận đổi mật khẩu tài khoản từ ${process.env.PORT_URL}</b>
      <br/>
      <div>Your code: ${OTP}</div>
      `,
    });
    if (info) {
      let u = await saveCodePassWord(email, OTP);
    }
  } catch (error) {
    console.log(error);
  }
};
const saveCodePassWord = async (email, code) => {
  await db.user.update({ OTP: code }, { where: { email: email } });
};
const checkOTPService = async (email, otp) => {
  let c = await db.user.findOne({
    where: {
      [Op.and]: [
        {
          email: email,
        },
        {
          OTP: otp,
        },
      ],
    },
  });
  if (c) {
    return true;
  }
  return false;
};
export default {
  createUserSocial,
  createAcessTokenSocial,
  sendCode,
  saveCodePassWord,
  checkOTPService,
};
