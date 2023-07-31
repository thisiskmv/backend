const express = require("express");
const { connection } = require("./config/db");
const { UserModel } = require("./models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { authentication } = require("./middlewares/middleware");

const { blogRouter } = require("./routes/blog.routes");
require("dotenv").config();
const app = express();

app.use(cors());

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send("base api route");
});

app.post("/signup", async (req, res) => {
  let { username, email, password} = req.body;
  bcrypt.hash(password, 3, async function (err, hash) {
    const new_user = new UserModel({
      username,
      email,
      password: hash,
    });
    try {
      await new_user.save();
      res.send({ message: "signup successful" });
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong, please try again leter");
    }
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.send("sign up first");
  } else {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        var token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY);
        res.send({ message: "log in successful", token: token });
      } else {
        res.send({ message: "login faild , invalid credentials" });
      }
    });
  }
});



app.use("/blogs", authentication, blogRouter);

app.listen(7400, async () => {
  try {
    await connection;
    console.log("connected to db successfully");
  } catch (error) {
    console.log("error while connecting to db");
    console.log(error);
  }
  console.log("listening on port 7400");
});
