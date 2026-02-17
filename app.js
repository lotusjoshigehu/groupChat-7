const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");

const app = express();
const sequelize = require("./connection/dbconnection");

/* ================= CONTROLLERS ================= */

const sigincontroller = require("./controllers/sigincontroller");
const logincontroller = require("./controllers/logincontroller");
const messagecontroller = require("./controllers/messagecontroller");
const groupcontroller = require("./controllers/groupcontrollers");
const uploadcontroller = require("./controllers/uploadcontroller");

/* ================= MODELS ================= */

const Message = require("./models/message");

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());

/* ================= MULTER SETUP ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

/* ================= STATIC FOLDER ================= */

app.use("/uploads", express.static("uploads"));

/* ================= ROUTES ================= */

// Auth
app.post("/signup", sigincontroller.signup);
app.post("/login", logincontroller.login);
app.post("/checkuser", logincontroller.checkuser);

// Private messages
app.post("/sendMessage", messagecontroller.sendmessage);
app.get("/getMessages", messagecontroller.getmessage);
app.get("/getChatUsers", messagecontroller.getchatusers);
app.post("/deleteforme", messagecontroller.deleteforme);

// Group
app.post("/addmember", groupcontroller.addmember);
app.post("/createGroup", groupcontroller.creategroup);
app.get("/getusergroups", groupcontroller.getusergroups);
app.get("/group/members/:groupId", groupcontroller.getgroupmembers);

// Upload
app.post("/upload", upload.single("file"), uploadcontroller.uploadfile);

/* ================= SOCKET SETUP ================= */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  /* ===== JOIN PRIVATE ROOM ===== */
  socket.on("join", (phone) => {
    socket.join(phone);
    console.log(`User joined private room: ${phone}`);
  });

  /* ===== PRIVATE MESSAGE ===== */
  socket.on("send-message", async (data) => {

    console.log("PRIVATE MESSAGE DATA:", data); 
    const { sender, receiver, text, fileUrl, fileType } = data;

    try {

      const savedMessage = await Message.create({
        sender,
        receiver,
        text: text || null,
        fileUrl: fileUrl || null,
        fileType: fileType || null
      });

      console.log("Saved Private Message:", savedMessage.toJSON());

      // Send to receiver room
      io.in(receiver).emit("receive-message", savedMessage);

      // Send back to sender room
      io.in(sender).emit("receive-message", savedMessage);

    } catch (err) {
      console.error("Private message error:", err);
    }
  });

  /* ===== JOIN GROUP ROOM ===== */
  socket.on("join-group", (groupId) => {
    socket.join(groupId);
    console.log(`User joined group room: ${groupId}`);
  });

  /* ===== GROUP MESSAGE ===== */
  socket.on("send-group-message", async (data) => {
    console.log("group MESSAGE DATA:", data); 

    const { sender, groupId, text, fileUrl, fileType } = data;

    try {

      const savedMessage = await Message.create({
        sender,
        groupId,
        text: text || null,
        fileUrl: fileUrl || null,
        fileType: fileType || null
      });

      console.log("Saved Group Message:", savedMessage.toJSON());

      io.in(groupId).emit("receive-group-message", savedMessage);

    } catch (err) {
      console.error("Group message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

/* ================= DATABASE SYNC ================= */

sequelize.sync({ alter: true }).then(() => {
  server.listen(4000, () => {
    console.log("Server running on port 4000");
  });
});
