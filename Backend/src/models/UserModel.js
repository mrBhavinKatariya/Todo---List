const { DataTypes } = require("sequelize");
const sequelize = require("../config/db/db.js");
const bcrypt = require("bcrypt");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

// Hash the user's password before saving it to the database
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

// Method to compare the provided password with the hashed password in the database
User.prototype.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;