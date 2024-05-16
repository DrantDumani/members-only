#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const bcrypt = require("bcrypt")
const User = require("./models/user");
const Post = require("./models/post");

const users = [];
const posts = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", "false");

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  await createPosts();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function userCreate(
  index,
  fName,
  lName,
  username,
  email,
  textPass,
  isMember = false,
  isAdmin = false
) {
  const password = await bcrypt.hash(textPass, 10)
  const userDetail = {
    fName,
    lName,
    username,
    email,
    password,
    isMember,
    isAdmin,
  };
  const user = new User(userDetail);
  await user.save();
  users[index] = user;
  console.log(`Added user: ${user}`);
}

async function postCreate(index, title, content, timestamp, author) {
  const post = new Post({ title, content, timestamp, author });
  await post.save();
  posts[index] = post;
  console.log(`Added post: ${title}`);
}

async function createUsers() {
  console.log("Adding users");
  await Promise.all([
    userCreate(
      0,
      "Paula",
      "Polestar",
      "GirlFromTwoson",
      "paula@polestar.com",
      "MrBear"
    ),
    userCreate(
      1,
      "Toyosatomimi",
      "Miko",
      "True Administrator",
      "tendesires@taoism.com",
      "TrulyThatOfHeaven",
      true,
      true
    ),
    userCreate(
      2,
      "Hatsune",
      "Miku",
      "Project_Diva01",
      "tupac@gmail.com",
      "meteor5",
      true
    ),
    userCreate(
      3,
      "Minch",
      "Porky",
      "KingP",
      "newPork@city.com",
      "bestFriendN",
      true
    ),
    userCreate(
      4,
      "Lich",
      "The",
      "LastScholarOfGolb",
      "oblivion@ooo.com",
      "TheEnchiridion"
    ),
  ]);
}

async function createPosts() {
  console.log("Adding posts");
  await Promise.all([
    postCreate(
      0,
      "Spankety Spankety!",
      "Come and get me, losers!",
      822793517753,
      users[3]
    ),
    postCreate(
      1,
      "PK Fire!",
      "I taught my friend Ness how to do this move.",
      1461657249764,
      users[0]
    ),
    postCreate(
      2,
      "I have observed all of your actions",
      "I can hear humans' desires. Desire tells of a human's true character. To understand the ten desires of a human is to know them fully.",
      26935804330,
      users[1]
    ),
    postCreate(3, "Fall", "You are alone, child.", 924821557008, users[4]),
    postCreate(
      4,
      "Aren't you cold?",
      "Walk into the well, Finn",
      1359553963330,
      users[4]
    ),
    postCreate(
      4,
      "Stop",
      "I have learned much from you. Thank you, my teachers. And now, for your education.",
      473706628088,
      users[4]
    ),
  ]);
}
