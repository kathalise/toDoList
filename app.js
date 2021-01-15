const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
// You can actually push items to a const-Array (not assign it a complete new array tho)

//////// Those Arrays have been used to store data without a DB
//////// With Mongoose no longer needed!!
/////// const items = ["Eat", "Sleep", "Code"];
////// const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

////// connecting to mongoDB & creating a new DB "todolistDB"
mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

////// Schema
const itemsSchema = {
    name: String,
};

///// model based on Schema
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your To Do List!",
});

const item2 = new Item({
    name: "Use the + to add new To Do Item",
});

const item3 = new Item({
    name: "<--- tick this box to delete Item from your List",
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Your Defaultitems have been inserted");
    }
});

app.get("/", function (req, res) {
    const day = date.getDate();
    res.render("list", { listTitle: day, newListItems: items });
});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work", newListItems: workItems });
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.post("/", function (req, res) {
    const item = req.body.newItem;
    const list = req.body.list;
    if (list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.listen(2000, function () {
    console.log("App running on port 2000!");
});
