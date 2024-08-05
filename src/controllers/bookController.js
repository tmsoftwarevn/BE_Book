import bookService from "../service/bookService";

const postCreateBook = async (req, res) => {
  let data = await bookService.createBookService(req.body);
  if (data && data.DT) {
    return res.status(201).json({
      message: "create success",
      data: data.info,
    });
  } else {
    return res.status(400).json({
      message: "Create fail",
    });
  }
};
const getInfoBook = async (req, res) => {
  let data = await bookService.getInfoBookService(req.params.id);
  if (data && data.DT) {
    return res.status(200).json({
      message: "Get info success",
      data: data.inf,
      EC: 1,
    });
  } else {
    return res.status(400).json({
      message: "Get info fail",
      EC: -1,
    });
  }
};

const deleteBook = async (req, res) => {
  let data = await bookService.deleteBookService(req.params.id);
  if (data && data.DT) {
    return res.status(200).json({
      data: "Delete success",
      EC: 1,
    });
  } else {
    return res.status(400).json({
      message: "wrong some thing",
    });
  }
};
const updateBook = async (req, res) => {
  let id = req.params.id;
  let up = req.body;
  let data = await bookService.updateBookService(id, up);
  if (data && data.DT) {
    return res.status(200).json({
      message: "Update success",
      data: data.DT,
    });
  } else {
    return res.status(400).json({
      message: "Some thing wrong",
    });
  }
};
const getListBookPaginateAdmin = async (req, res) => {
  let { current, pageSize, field, sort, mainText, price, category } = req.query;
  let data = await bookService.getListBookService(
    current,
    pageSize,
    field,
    sort,
    mainText,
    price,
    category
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
};

const getListBookHome = async (req, res) => {
  const { current, pageSize, category, field, sort, rate, price } = req.query;

  let data = await bookService.getListBookHomeService(
    current,
    pageSize,
    category,
    field,
    sort,
    rate,
    price
  );
  if (data && data.list) {
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
    return res.status(400).json({
      message: "Something wrong ",
      EC: -1,
    });
  }
};
const putBookAfterOrder = async (req, res) => {
  let data = await bookService.updateBookAfterOrder(
    +req.body.id,
    +req.body.count
  );
  if (data && data.DT) {
    return res.status(200).json({
      EC: 1,
      data: data.DT,
    });
  } else {
    return res.status(400).json({
      message: "Có lỗi xảy ra",
    });
  }
};
const getListBookPopulateAll = async (req, res) => {
  let data = await bookService.listBookPopulateServiceAll();

  if (data && data.DT) {
    return res.status(200).json({
      EC: 1,
      data: data.DT,
    });
  } else {
    return res.status(400).json({
      message: "Có lỗi xảy ra",
    });
  }
};

const getListSearchBook = async (req, res) => {
  const { current, pageSize, mainText } = req.query;
  let data = await bookService.searchBookService(mainText, current, pageSize);
  if (data && data.list) {
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
    return res.status(400).json({
      message: "Something wrong ",
      EC: -1,
    });
  }
};

const get_list_from_idParent = async (req, res) => {
  try {
    let data = await bookService.get_list_from_idParent(req.body.arrId);

    if (data) {
      return res.status(200).json({
        EC: 1,
        data: data,
      });
    } else {
      return res.status(400).json({
        message: "Có lỗi xảy ra",
        EC: -1,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "err server",
      EC: -1,
    });
  }
};

export default {
  postCreateBook,
  getInfoBook,
  getListBookPaginateAdmin,
  deleteBook,
  updateBook,
  getListBookHome,
  putBookAfterOrder,
  getListBookPopulateAll,
  getListSearchBook,
  get_list_from_idParent,
};
