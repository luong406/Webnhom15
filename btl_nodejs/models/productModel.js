const db = require("./db");

const findAllProducts = () => {
    return db
      .query("SELECT * FROM products")
      .then(([rows]) => rows); // Trả về người dùng đầu tiên hoặc undefined nếu không tìm thấy
  };

  module.exports = {
    findAllProducts
  };
  