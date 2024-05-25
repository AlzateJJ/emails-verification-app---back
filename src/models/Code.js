const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const code = sequelize.define('code', {
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // UserId
});

module.exports = code;