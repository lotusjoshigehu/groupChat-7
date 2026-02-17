const { DataTypes } = require("sequelize");
const sequelize = require("../connection/dbconnection");

const message = sequelize.define("message", {
  sender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  receiver: {
    type: DataTypes.STRING,
    allowNull: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deletedFor: {
  type: DataTypes.STRING,
  defaultValue: ""
  
},
groupId: {
  type: DataTypes.STRING,
  allowNull: true
},
fileUrl: {
  type: DataTypes.STRING,
  allowNull: true
},
fileType: {
  type: DataTypes.STRING,
  allowNull: true
}
});

module.exports = message;
