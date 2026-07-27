const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;


// View engine
app.set("view engine", "ejs");


// Static files
app.use(express.static(path.join(__dirname, "public")));


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));


// Home route
app.get("/", (req, res) => {
    res.render("index");
});


// Services route
app.get("/services", (req, res) => {
    res.render("services");
});


// Contact route
app.get("/contact", (req, res) => {
    res.render("contact");
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});