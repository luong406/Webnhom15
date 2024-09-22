const db = require("./db");

const findAllProducts = () => {
    return db
      .query("SELECT * FROM products")
      .then(([rows]) => rows); // Trả về người dùng đầu tiên hoặc undefined nếu không tìm thấy
  };

  const updateProduct = (productId, quantity) =>{
    return db
    .query("UPDATE products set quantity = ? where product_id = ? ", [quantity, productId]);
  }
  const findProductById = (productId) => {
    return db
      .query("SELECT * FROM products where product_id = ? ", [productId])
      .then(([rows]) => rows[0]); // Trả về người dùng đầu tiên hoặc undefined nếu không tìm thấy
  };

  const addOrder = (user) => {
    return db
      .query("INSERT INTO orders(user_id, address, full_name, phone_number, descrip) VALUES (?, ?, ?, ?, ?)", 
        [user.user_id, user.address, user.full_name, user.phone_number, user.descrip]
      )
      .then(result => {
        console.log(result);
        return result[0].insertId; // Trả về ID của đơn hàng vừa thêm
      })
      .catch(err => {
        console.error("Error adding order:", err);
        throw err; // Ném lại lỗi để xử lý bên ngoài nếu cần
      });
  };
  
  const addProductOrder = (order_id, products) => {
    const queries = products.map(product => {
      return db.query("INSERT INTO product_orders(product_id, order_id, number) VALUES(?, ?, ?)", 
        [parseInt(product.product_id), order_id, product.quantity]
      );
    });
  
    return Promise.all(queries) // Chờ tất cả các truy vấn hoàn thành
      .then(results => {
        return results; // Trả về kết quả nếu cần
      })
      .catch(err => {
        console.error("Error adding product orders:", err);
        throw err; // Ném lại lỗi để xử lý bên ngoài nếu cần
      });
  };
  

  module.exports = {
    findAllProducts,
    findProductById,
    updateProduct,
    addOrder,
    addProductOrder
  };
  