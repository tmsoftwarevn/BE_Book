const db = require("../models");
import socialService from "../service/socialService";
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const getCode = async (req, res) => {
  try {
    if (!validateEmail(req.body.email)) {
      return res.status(400).json({
        message: "Email chưa đúng định dạng",
      });
    }
    let user = await db.user.findOne({
      where: {
        email: req.body.email,
      },
      raw: true,
    });
    if (user) {
      await socialService.sendCode(req.body.email);
      return res.status(200).json({
        EC: 1,
        message: "Hãy kiểm tra email để lấy mã xác nhận",
      });
    } else {
      return res.status(400).json({
        message: "Email chưa được đăng kí",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Some thing wrong",
    });
  }
};
const checkOTP = async (req, res) => {
  let data = await socialService.checkOTPService(req.body.email, req.body.OTP);
  if (data === true) {
    await socialService.saveCodePassWord(req.body.email, null);
    return res.status(200).json({
      EC: 1,
      message: "OTP is correct",
    });
  } else {
    return res.status(400).json({
      EC: -1,
      message: "OTP or email is incorrect",
    });
  }
};
export default { getCode, checkOTP };
