const db = require("./db");
const bcrypt = require("bcryptjs");

// Hàm tìm người dùng theo tên đăng nhập
const findUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users WHERE user_name = ?", [username])
    .then(([rows]) => rows[0]); // Trả về người dùng đầu tiên hoặc undefined nếu không tìm thấy
};
// Hàm tìm người dùng theo user_id
const findUserById = (user_id) => {
  return db
    .query("SELECT * FROM users WHERE user_id = ?", [user_id])
    .then(([rows]) => rows[0]); // Trả về người dùng đầu tiên hoặc undefined nếu không tìm thấy
};

const createUser = (username, password, address, phone_number, sex, role) => {
  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return db.query(
        "INSERT INTO users (user_name, password, address, phone_number, sex, role) VALUES (?, ?, ?, ?, ?, ?)",
        [username, hashedPassword, address, phone_number, sex, role]
      );
    })
    .then((result) => {
      console.log("User created successfully:", result[0].insertId);
      return result[0].insertId; // Trả về kết quả hoặc thông tin của người dùng mới được tạo
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      throw error;
    });
};

module.exports = {
  findUserById,
  findUserByUsername,
  createUser,
};
