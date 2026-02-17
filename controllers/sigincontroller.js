const users=require("../models/users")
const bcrypt=require("bcrypt")

const signup=async (req,res)=>
{
    try {
        const {name,phone,email,password}= req.body
        const alreadyuser=await users.findOne({where:{email}})
        if(alreadyuser)
        {
            return res.status(409).json({message:"user already exits"})
        }
        
        const encryptpassword= await bcrypt.hash(password,10)

        await users.create({
            name:name,
            phone:phone,
            email:email,
            password:encryptpassword
        })
        res.status(201).json({message:"signup suceesfully"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"error in storing the data"})
        
    }
}

module.exports={signup}