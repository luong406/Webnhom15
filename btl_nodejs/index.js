const express = require('express')
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const app = express()
const port = 3000
const userRouter = require('./routers/userRouter');
const adminRouter = require('./routers/adminRouter');

// Cấu hình thư mục views (nơi lưu trữ các tệp .ejs)
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(
  session({
    secret: 'your-secret-key', // Chuỗi bí mật để ký session ID cookie
    resave: false,              // Không lưu lại session nếu không thay đổi
    saveUninitialized: true,    // Lưu session mới dù chưa có dữ liệu
    cookie: { maxAge: 60000 }   // Đặt thời gian hết hạn cookie (miliseconds)
  })
);

// Cấu hình express(lần lượt: chuyển đổi request thành json, lấy dữ liệu từ form html, để thư mục public hiển thị trên web)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

function checkAuthentication(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated(); // Kiểm tra trạng thái đăng nhập
  next();
}

// Sử dụng middleware trong ứng dụng của bạn
app.use(checkAuthentication);

app.use('/',userRouter);
app.use('/admin',adminRouter);

require('./configs/passportConfig')(passport);
app.get('/check_session', (req, res) => {
  res.json(req.session);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
