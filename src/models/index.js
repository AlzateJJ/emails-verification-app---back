const code = require("./Code");
const User = require("./User");

code.belongsTo(User)
User.hasOne(code)