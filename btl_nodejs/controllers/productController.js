const Product = require("../models/productModel");
const passport = require("passport");
exports.getHome = (req, res, next) => {
  Product.findAllProducts()
    .then((result) => {
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

exports.addCart = (req, res, next) => {
  const {
    productId
  } = req.body; // Lấy productId từ request

  // Kiểm tra nếu session chưa có giỏ hàng thì khởi tạo
  if (!req.session.cart) {
    req.session.cart = [];
  }

  // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng hay chưa
  const existingProductIndex = req.session.cart.findIndex(item => item === productId);

  if (existingProductIndex !== -1) {
    // Nếu sản phẩm đã có trong giỏ hàng
    return res.json({
      message: 'Sản phẩm đã được thêm vào giỏ hàng rồi',
      cart: req.session.cart
    });
  } else {
    // Nếu sản phẩm chưa có trong giỏ hàng, thêm vào giỏ hàng
    req.session.cart.push(productId);
    return res.json({
      message: 'Thêm sản phẩm thành công',
      cart: req.session.cart
    });
  }
};

exports.addOrder = (req, res, next) => {
  const {
    orderItems
  } = req.body;

  if (!orderItems || !Array.isArray(orderItems)) {
    return res.status(400).json({ message: 'Dữ liệu giỏ hàng không hợp lệ' });
  }

  // Nếu req.session.order chưa được khởi tạo, khởi tạo nó
  req.session.order = [];
  orderItems.forEach(orderItem =>
    req.session.order.push(orderItem)
  );
  return res.json({
    message: 'Thêm sản phẩm thành công',
    order: req.session.order
  });

};


exports.getCart = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.render("login", {
      title: "Đăng nhập",
      message: `Vui lòng đăng nhập để xem giỏ hàng`
    });
  } else {
    const productIds = req.session.cart || [];

    if (productIds.length === 0) {
      return res.render('cart', {
        products: []
      });
    }

    try {
      // Sử dụng Promise.all để đợi tất cả các truy vấn hoàn thành
      const products = await Promise.all(
        productIds.map(productId => Product.findProductById(productId))
      );

      // Render trang giỏ hàng và truyền dữ liệu sản phẩm vào
      res.render('cart', {
        products
      });
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm:', err);
      res.status(500).send('Lỗi server');
    }
  }

};


exports.getOrder = (req, res) => {

  // Render lại trang đơn hàng với dữ liệu từ session
  res.render('order', { order: req.session.order, user: req.session.passport.user });
};

exports.submitOrder = (req, res) => {
  const { orderDataUser } = req.body;
  const products = req.session.order;
  console.log(orderDataUser);
  const orderData = {
    user_id: req.session.passport.user.user_id,
    full_name: orderDataUser.full_name,
    address: orderDataUser.address,
    phone_number: orderDataUser.phone_number,
    descrip: orderDataUser.descrip
  };
  console.log(orderData);
  if (!checkProducts(products)) {
    res.status(500).json({ message: "Số lượng hàng của shop không đủ" });
  }
  else {
    Product.addOrder(orderData)
      .then((result) => {
        console.log(result);
        Product.addProductOrder(result, products)
          .then((data) => {
            console.log(data)
          })
          .catch(err => {
            console.log(err);
          });

        updateProducts(products);
        req.session.order = [];
        req.session.cart = [];
        res.status(201).json({ message: "Đặt hàng thành công" });
      })
      .catch(err => {
        // Xử lý lỗi
        console.error(err);
        res.status(500).json({ message: "Có lỗi xảy ra" });
      });
  }
}
const updateProducts = async (products) => {
  for (const product of products) {
    try {
      const productDb = await Product.findProductById(product.product_id);
      if (productDb) {
        await Product.updateProduct(product.product_id, productDb.quantity - product.quantity);
      } else {
        console.log(`Sản phẩm với ID ${product.product_id} không tồn tại.`);
      }
    } catch (err) {
      console.error(`Có lỗi xảy ra khi cập nhật sản phẩm với ID ${product.product_id}:`, err);
    }
  }
};

const checkProducts = async (products) => {
  for (const product of products) {
    try {
      const productDb = await Product.findProductById(product.product_id);
      if (!productDb || productDb.quantity < product.quantity) {
        return false; // Nếu sản phẩm không tồn tại hoặc số lượng không đủ
      }
    } catch (err) {
      return false; // Nếu có lỗi trong quá trình tìm sản phẩm
    }
  }
  return true; // Tất cả sản phẩm đủ số lượng
};
exports.addProduct = (req, res) =>{
  console.log(req.body);
  Product.createProduct(req.body.product_name, req.body.price, req.body.discrip, req.body.image, req.body.discount, req.body.quantity)
  .then(result =>{
    console.log("Thanh cong");
    res.status(201).json({
      message: "Sản phẩm đã được tạo thành công!",
      product: req.body
    });
  })
  .catch(err =>{
    console.log("That bai do loi db, truyen thieu du lieu");
    res.status(500).json({
      message: "Thêm sản phẩm thất bại!",
      error: err
    });
  });
}
exports.deleteProduct=(req,res) =>{
  console.log(req.params.product_id);
  Product.deleteProduct(req.params.product_id)
  .then(result =>{
    res.status(201).json({
      message:"Xoa san pham thanh cong!",
      product: req.params.product_id
    });
  })
  .catch(err =>{
    console.log ("Xoa that bai");
    res.status(500).json({
      message:"Xoa lai di!",
      error:err
    });
  });
}
  exports.getProduct=(req,res) =>{
    console.log(req.params.product_id);
    Product.getProduct(req.params.product_id)
    .then(result =>{
      res.status(201).json({
        message:"Hien thi san pham!",
        product: result[0]
      });
    })
    .catch(err =>{
      console.log ("Khong tim thay san pham");
      res.status(500).json({
        message:"Tim lai di!",
        error:err
      });
    });
};

