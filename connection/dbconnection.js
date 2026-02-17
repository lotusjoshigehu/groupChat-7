const {Sequelize}=require("sequelize")

const sequelize= new Sequelize("lotus","root","lotus",
    {
        host:"localhost",
        dialect:"mysql"
    }
);

(async ()=> { 
    try {
     await sequelize.authenticate()
     console.log("data synced sucessfully")
    
} catch (error) {
    console.log(error)   
}
})()

module.exports=sequelize