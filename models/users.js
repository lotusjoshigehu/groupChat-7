const {DataTypes}=require("sequelize")
const sequelize=require("../connection/dbconnection")

const Users=sequelize.define("users",
    {
        id:
        {
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:
        {
           type:DataTypes.STRING,
           allowNull:false
        },
        phone:
        {
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false
        },
        password:
        {
            type:DataTypes.STRING,
            allowNull:false
        }
    }
)

module.exports=Users
