const db = require("../models");
const getStatusService = async () => {
  let g = await db.status.findAll({});
  if (g) {
    return {
      DT: g,
    };
  }
};
export default { getStatusService };
