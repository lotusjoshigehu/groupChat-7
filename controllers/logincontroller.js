const users=require("../models/users")
const {Op}=require("sequelize")
const bcrypt=require("bcrypt")

const login=async(req,res)=>
{
    try {
    const{emorph,password}=req.body
    const user=await users.findOne(
        {
            where:
            {
                [Op.or]:
                [
                {email:emorph},
                {phone:emorph}
                ]
            }
        })
        if (!user)
        {
            return res.status(404).json({message:"user not found"})
        }

        const decryptpassword=await bcrypt.compare(password,user.password)
        if(!decryptpassword)
        {
            return res.status(401).json({message:"password not correct"})
        }
        res.status(200).json({
            message:"succesfull login",
            name:user.name,
            phone:user.phone

        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"error in login"})
        
    }
}


const checkuser=async(req,res)=>
{
    try {
        const {phone}=req.body
        const user=await users.findOne(
            {
                where:{phone}
            }
        )
        if(!user)
        {
            return res.status(404).json({message:"user not found"})
        }
        res.status(200).json({
            message:"user found",
            name:user.name
            })

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"error in storing the data"})

        
    }
}
module.exports={login,checkuser}