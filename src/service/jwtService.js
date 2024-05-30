//import db from "../models";
const db = require("../models");
import checkMiddleware from "../middleware/checkMiddleware";

const getInfoUser = async (user) => {
  try {
    const info = await db.user.findOne({
      where: { id: user.id },
      attributes: [
        "fullName",
        "email",
        "type",
        "role",
        "id",
        "createdAt",
        "updatedAt",
      ],
      raw: true,
    });
    return info ? info : {};
  } catch (error) {
    console.log(error);
  }
};
const getAccount = async (req, res) => {
  try {
    let infoUser = await getInfoUser(req.account);
    return res.status(200).json({
      EC: 1,
      data: infoUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      message: "wrong some thing at server",
    });
  }
};
const saveRefreshToken = async (user, newRT) => {
  const update = await db.user.update(
    { refreshToken: newRT },
    { where: { email: user.email }, raw: true }
  );
};

const newAccessTokenFromRT = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (cookies && cookies?.refreshToken) {
      const checkUser = await db.user.findOne({
        where: { refreshToken: cookies.refreshToken },
      });
      let decoded = checkMiddleware.verifyToken(cookies.refreshToken);
      if (checkUser && decoded) {
        let infoUser = await getInfoUser(decoded);
        let access_token = checkMiddleware.createJWT(infoUser);
        return res.status(200).json({
          data: {
            access_token: access_token,
          },
        });
      }
      return res.status(400).json({
        message: "Refresh Token hết hạn hoặc không đúng.",
        EC: -1,
      });
    } else {
      return res.status(400).json({
        message: "Không tìm thấy refresh token ở cookie",
        EC: -1,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: -1,
      message: "wrong some thing at server",
    });
  }
};
const deleteRefreshToken = async (id) => {
  if (id) {
    let d = await db.user.update({ refreshToken: null }, { where: { id: id } });
  }
};
export default {
  getInfoUser,
  saveRefreshToken,
  newAccessTokenFromRT,
  getAccount,
  deleteRefreshToken,
};
