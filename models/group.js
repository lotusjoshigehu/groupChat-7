const { DataTypes } = require("sequelize");
const sequelize = require("../connection/dbconnection");

const Group = sequelize.define("Group", {
  groupId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  groupName: {
    type: DataTypes.STRING
  },
  members: {
    type: DataTypes.TEXT  
  }
});

module.exports = Group;
