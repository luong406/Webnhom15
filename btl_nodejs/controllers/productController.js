const Product = require("../models/productModel");
exports.getHome = (req, res, next) => {
    Product.findAllProducts()
      .then((result) => {
        console.log(result);
        const message = req.flash("error")[0];
        res.render("home", {
          title: "Trang chủ",
          message: `${message}`,
          product: result,
        });
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        // Xử lý lỗi hoặc render trang với thông báo lỗi tùy thuộc vào mong muốn của bạn
        res.render("home", {
          title: "Trang chủ",
          message: "Đã có lỗi xảy ra khi lấy sản phẩm.",
          product: [], // Có thể đặt là mảng rỗng hoặc giá trị phù hợp
        });
      });
  };
  exports.getTest = (req, res, next) => {
   
        res.render("products")
    
  };
  
  