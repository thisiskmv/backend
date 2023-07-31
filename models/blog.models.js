const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, requires: true },
    category: { type: String, requires: true },
    author: { type: String, requires: true  },
    email: { type: String, requires: true  },
    image:{ type: String}
  },
  {
    timestamps: true,
  }
);

const BlogModel = mongoose.model("blog", BlogSchema);

module.exports = { BlogModel };
