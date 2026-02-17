const Group = require("../models/group");
const User=require("../models/users")

const creategroup = async (req, res) => {

  try {

    const { groupName, creatorPhone } = req.body;

    const groupId = "grp_" + Date.now();

    await Group.create({
      groupId,
      groupName,
      members: creatorPhone   // only creator added
    });

    res.json({ groupId, groupName });

  } catch (err) {
    res.status(500).json({ message: "Error creating group" });
  }
};


const getusergroups = async (req, res) => {

   
  try {

    const { phone } = req.query;

    const groups = await Group.findAll();

    const userGroups = groups.filter(group => {

      const members = group.members
        .split(",")
        .map(m => m.trim());   

      return members.includes(phone);
    });

    res.json(userGroups);

  } catch (err) {
    res.status(500).json({ message: "Error fetching groups" });
  }
};

const addmember = async (req, res) => {

  try {

    const { groupId, memberPhone } = req.body;

    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    let members = group.members
      .split(",")
      .map(m => m.trim());

    if (!members.includes(memberPhone)) {
      members.push(memberPhone);
      group.members = members.join(",");  // no spaces
      await group.save();
    }

    res.json({ message: "Member added" });

  } catch (err) {
    res.status(500).json({ message: "Error adding member" });
  }
};

const Users = require("../models/users"); // correct model

const getgroupmembers = async (req, res) => {

  try {

    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Convert "98765,99988" → ["98765","99988"]
    const memberPhones = group.members
      .split(",")
      .map(m => m.trim());

    // Fetch users from Users table
    const users = await Users.findAll({
      where: {
        phone: memberPhones
      },
      attributes: ["name", "phone"]
    });

    res.json({ members: users });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }

};



module.exports={
    creategroup,
    getusergroups,
    addmember,
    getgroupmembers
}