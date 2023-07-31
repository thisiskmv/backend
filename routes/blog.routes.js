const { Router } = require("express");
const { BlogModel } = require("../models/blog.models");
const { UserModel } = require("../models/User.model");
const blogRouter = Router();

//get request
blogRouter.get("/", async (req, res) => {
  const blogData = await BlogModel.find();
  res.send({ responseData: blogData });
});

//create blog
blogRouter.post("/create", async (req, res) => {
  const { title, category,image } = req.body;
  const author_id = req.user_id;
  // console.log(author_id);
  const user = await UserModel.findOne({ _id: author_id });
  console.log(user);
  const new_blog = new BlogModel({
    title,
    category,
    image,
    author: user.username,
  });
  await new_blog.save();
  res.send("blog created");
});

//edit blog
blogRouter.put("/edit/:blogId", async (req, res) => {
  const blogId = req.params.blogId;
  const payload = req.body;

  const user_id = req.user_id;
  const user = await UserModel.findOne({ _id: user_id });
  const user_email = user.email;

  const blog = await BlogModel.findOne({ _id: blogId });
  const blog_author_email = user.email;
console.log(user_email,blog_author_email)
  if (user_email != blog_author_email) {  
    res.send("you are unauthorized to do this operation");
  } else {
    await BlogModel.findByIdAndUpdate(blogId, payload);
    res.send(`blog  ${blogId} edited`);
  }
});

blogRouter.delete("/delete/:blogId", async (req, res) => {
  const blogId = req.params.blogId;

  const user_id = req.user_id;
  const user = await UserModel.findOne({ _id: user_id });
  const user_email = user.email;

  const blog = await BlogModel.findOne({ _id: blogId });
  const blog_author_email = user.email;
  console.log(user_email,blog_author_email)
  if (user_email != blog_author_email) {
    res.send("you are unauthorized to do this operation");
  } else {
    await BlogModel.findByIdAndDelete(blogId);
    res.send(`blog  ${blogId} deleted`);
  }
});

module.exports = { blogRouter };
