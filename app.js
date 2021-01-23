const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

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

const listsSchema = {
    name: String,
    items: [itemsSchema],
};

const List = mongoose.model("List", listsSchema);

const item1 = new Item({
    name: "Welcome to your To Do List!",
});

const item2 = new Item({
    name: "Hit the (+) to add new To Do Item",
});

const item3 = new Item({
    name: "<-- Hit Box to delete Item from List",
});

const defaultItems = [item1, item2, item3];
const day = date.getDate();

app.get("/", function (req, res) {
    Item.find({}, function (err, foundItems) {
        if (err) {
            console.log(err);
        } else {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Your Defaultitems have been inserted");
                    }
                });
                res.redirect("/");
            } else {
                res.render("list", {
                    listTitle: day,
                    newListItems: foundItems,
                });
            }
        }
    });
});

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);
    const aboutPage = _.capitalize("About");
    if (customListName === aboutPage) {
        res.render("about");
    } else {
        List.findOne({ name: customListName }, function (err, result) {
            if (!err) {
                if (result) {
                    res.render("list", {
                        listTitle: result.name,
                        newListItems: result.items,
                    });
                } else {
                    const list = new List({
                        name: customListName,
                        items: defaultItems,
                    });

                    list.save();
                    res.redirect("/" + customListName);
                }
            } else {
                console.log(err);
            }
        });
    }
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName,
    });

    if (listName === day) {
        console.log("day:", day);
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            if (!err) {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            }
        });
    }
});

app.post("/delete", function (req, res) {
    const itemCheckedId = req.body.checkbox;
    const listName = req.body.listName;

    console.log(listName);

    if (listName === day) {
        Item.findByIdAndRemove(itemCheckedId, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: itemCheckedId } } },
            function (err, foundList) {
                if (!err) {
                    res.redirect("/" + listName);
                } else {
                    console.log(err);
                }
            }
        );
    }
});

app.listen(2000, function () {
    console.log("App running on port 2000!");
});
