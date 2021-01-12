const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
// You can actually push items to a const-Array (not assign it a complete new array tho)
const items = ["Eat", "Sleep", "Code"];
const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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
