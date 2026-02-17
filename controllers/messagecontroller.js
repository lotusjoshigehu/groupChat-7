const message = require("../models/message");
const { Op } = require("sequelize");


const sendmessage = async (req, res) => {

  try {
    const { sender, receiver, text } = req.body;

    await message.create({
      sender,
      receiver,
      text
    });

    res.json({ message: "Message saved" });

  } catch (err) {
    res.status(500).json({ message: "Error saving message" });
  }
};

const getmessage = async (req, res) => {

  try {

    const { user1, user2, groupId } = req.query;

    /* ===== GROUP MESSAGE ===== */
    if (groupId) {

      const messages = await message.findAll({
        where: { groupId },
        order: [["createdAt", "ASC"]]
      });

      return res.json(messages);
    }

    /* ===== PRIVATE MESSAGE ===== */
    const messages = await message.findAll({
      where: {
        [Op.or]: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 }
        ]
      },
      order: [["createdAt", "ASC"]]
    });

    const filtered = messages.filter(msg =>
      !msg.deletedFor || !msg.deletedFor.includes(user1)
    );

    res.json(filtered);

  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};


const getchatusers = async (req, res) => {

  try {
    const { phone } = req.query;

    const messages = await message.findAll({
      where: {
        [Op.or]: [
          { sender: phone },
          { receiver: phone }
        ]
      },
      order: [["createdAt", "DESC"]]
    });

    const users = [];
    const unique = new Set();

    messages.forEach(msg => {

      const otherUser =
        msg.sender === phone ? msg.receiver : msg.sender;

      if (!unique.has(otherUser)) {
        unique.add(otherUser);

        users.push({
          phone: otherUser,
          lastMessage: msg.text,
          time: msg.createdAt
        });
      }
    });

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: "Error loading chats" });
  }
};


const deleteforme = async (req, res) => {

  const { userPhone, otherUser } = req.body;

  const messages = await message.findAll({
    where: {
      [Op.or]: [
        { sender: userPhone, receiver: otherUser },
        { sender: otherUser, receiver: userPhone }
      ]
    }
  });

  for (let msg of messages) {

    if (!msg.deletedFor.includes(userPhone)) {

      msg.deletedFor = msg.deletedFor
        ? msg.deletedFor + "," + userPhone
        : userPhone;

      await msg.save();
    }
  }

  res.json({ message: "Deleted for you only" });
};



module.exports={sendmessage,getmessage,getchatusers,deleteforme}