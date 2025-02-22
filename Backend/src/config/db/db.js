
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, 
});


sequelize.authenticate()
    .then(() => console.log("✅ MySQL Database Connected Successfully!"))
    .catch((error) => console.error("❌ Database Connection Failed:", error));

module.exports = sequelize;