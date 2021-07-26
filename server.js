// Setup empty JS object to act as endpoint for all routes
let appData = {};
// Express to run server and routes
const express = require("express");
// Start up an instance of app
const app = express();
//Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());
// Initialize the main project folder
const websiteFolder = "website";
app.use(express.static(websiteFolder));
// Spin up the server // Callback to debug
const port = 8000;
const host = "localhost";
const callbackListen = () => {
    console.log(`Server running`);
    console.log(`Running on localhost : ${port}`);
    console.log(`Click => http://${host}:${port}`);
};
app.listen(port, callbackListen);
// Callback function to complete GET '/all'
const getAppData = (req, res) => {
    res.send(appData);
};
// GET Initialize all route with a callback function
app.get("/all", getAppData);
// Callback function to complete POST '/add'
const addNewData = (req, res) => {
    appData = req.body;
    console.log(appData);
    res.send(appData);
};
// POST Initialize add route with a callback function
app.post("/add", addNewData);

