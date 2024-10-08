import express from "express";
const router = express.Router();
import apiController from "../controllers/apiController";
import checkMiddleware from "../middleware/checkMiddleware";
import jwtService from "../service/jwtService";
import passport from "passport";
import socialService from "../service/socialService";
import postFileUploadImage from "../controllers/fileController";
import bookController from "../controllers/bookController";
import categoryController from "../controllers/categoryController";
import deliveryController from "../controllers/deliveryController";
import orderController from "../controllers/orderController";
import orderDetailController from "../controllers/orderDetailController";
import statusController from "../controllers/statusController";
import userService from "../service/userService";
import forgotPassword from "../controllers/forgotPassword";
import homeController from "../controllers/homeController";
import baivietController from "../controllers/baivietController";
require("dotenv").config();
const initApiRouter = (app) => {
  router.get("/", (req, res) => {
    res.send("helloooooo");
  });
  //--------- login google--------------------
  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  router.get(
    "/google/redirect",
    // passport.authenticate("google"),
    // (req, res) => {
    //   console.log("checkkkkkk reqqqqqqqq", req.user);
    //   res.redirect("/");
    // }
    passport.authenticate("google", {
      successRedirect: `${process.env.PORT_URL}/login`,
      failureRedirect: `${process.env.PORT_URL}/login`,
      // successRedirect: `${process.env.PORT_URL}/FE-book-deploy/login`,
      // failureRedirect: `${process.env.PORT_URL}/FE-book-deploy/login`,
    })
  );
  //-------------- login facebook-----------------
  router.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["public_profile", "email"] })
  );
  router.get(
    "/facebook/redirect",
    passport.authenticate("facebook", {
      successRedirect: `${process.env.PORT_URL}/login`,
      failureRedirect: `${process.env.PORT_URL}/login`,
    })
  );
  //-----------------------------------------
  router.get("/login/success", socialService.createAcessTokenSocial);
  // router.get("/login/success", (req, res, next) => {
  //   res.redirect(`${process.env.PORT_URL}/login`);
  //   console.log("check req router: ", req.user);
  // });
  // router.get("/login/failed", (req, res) => {
  //   res.status(400).json({
  //     message: "Login failed",
  //   });
  // });
  router.get("/social/logout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      //res.redirect(`${process.env.PORT_URL}/login`);
      res.redirect(`${process.env.PORT_URL}/login`);
    });
  });
  //---------------------------------

  router.post("/auth/login", apiController.postLogin);
  router.get("/auth/account", checkMiddleware.checkJWT, jwtService.getAccount);
  router.get("/auth/refresh", jwtService.newAccessTokenFromRT);
  router.post(
    "/auth/logout",
    checkMiddleware.checkJWT,
    apiController.postLogout
  );

  router.post("/user/register", apiController.postRegisterUser);
  router.get("/user", checkMiddleware.checkJWT, apiController.getListUser);
  router.delete(
    "/user/:id",
    checkMiddleware.checkJWT,
    apiController.delelteUser
  );

  router.post("/file/upload", checkMiddleware.checkJWT, postFileUploadImage);

  router.post("/book", checkMiddleware.checkJWT, bookController.postCreateBook);
  router.get("/book/:id", bookController.getInfoBook);
  router.get(
    "/book",
    checkMiddleware.checkJWT,
    bookController.getListBookPaginateAdmin
  );
  router.get("/home/book", bookController.getListBookHome);
  router.delete(
    "/book/delete/:id",
    checkMiddleware.checkJWT,
    bookController.deleteBook
  );
  router.put("/book/:id", checkMiddleware.checkJWT, bookController.updateBook);
  router.put("/updateBook", bookController.putBookAfterOrder);

  // category
  router.post("/category/create", categoryController.postCreateCategory);
  router.get("/database/category", categoryController.getListCategory);
  router.delete("/category/:id", categoryController.delete_category);
  router.put("/category/:id", categoryController.update_category);
  router.get("/parentCategory/:id", categoryController.get_Parent_Category);
  router.get(
    "/parentCategoryHome",
    categoryController.get_category_parent_home
  );

  router.post("/delivery", deliveryController.postCreateInfoDelivery);
  router.get("/delivery/:id", deliveryController.getInfoDelivery);
  router.put("/delivery/:id", deliveryController.putInfoDelivery);

  router.post(
    "/order",
    checkMiddleware.checkJWT,
    orderController.postCreateOrder
  );
  router.get(
    "/user/orderHistory/:id",
    checkMiddleware.checkJWT,
    orderController.fetchOrderHistory
  );
  router.get("/order", checkMiddleware.checkJWT, orderController.getOrderAdmin);
  router.put("/orderStatus/:id", orderController.putOrderStatus);

  router.post(
    "/orderDetail",
    checkMiddleware.checkJWT,
    orderDetailController.postOrderDetail
  );
  router.get(
    "/orderDetail/:id",
    checkMiddleware.checkJWT,
    orderDetailController.getOrderDetail
  );

  router.get(
    "/status",
    checkMiddleware.checkJWT,
    statusController.getStatusAdmin
  );

  router.put("/user/:id", apiController.putUser);
  router.put("/user", apiController.checkPass, apiController.putPasswordUser);

  router.post("/forgot-password", forgotPassword.getCode);
  router.post("/checkOTP", forgotPassword.checkOTP);
  router.post("/newPass", apiController.putPasswordUser);

  router.get("/user/orderStatus/:id", orderController.fetchOrderStatus);

  router.get("/book/popular/all", bookController.getListBookPopulateAll);
  router.get("/search", bookController.getListSearchBook);

  // book list idParent
  router.post("/listbook_idparent", bookController.get_list_from_idParent);

  router.post("/listbook_related", bookController.get_list_related);
  router.post("/listbook_arrid_paginate", bookController.get_list_from_arrId_paginate);


  // home
  router.post("/home", homeController.postCreateHome);
  router.put("/home/:id", homeController.update_Home);
  router.delete("/home/:id", homeController.delete_Home);
  router.get("/home", homeController.getListHome);

  // bai viet

  router.post("/baiviet", baivietController.insertBaiviet);
  router.put("/baiviet/:id", baivietController.updateBaiviet);
  router.delete("/baiviet/:id", baivietController.deleteBaiviet);
  router.get("/baiviet/:slug", baivietController.get_detail_baiviet);
  router.get("/search-baiviet", baivietController.search_baiviet);

  router.get("/listbaiviet-home", baivietController.get_all_baiviet_paginate);
  router.get("/listbaiviet-admin", baivietController.get_all_baiviet);
  router.get("/noibat-home", baivietController.get_baiviet_trangchu);

  return app.use("/api/v1", router);
};

export default initApiRouter;
