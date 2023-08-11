const path = require("path");
const fs = require("fs");
const model = require("../models/model");

function displayForm(req, res) {
  res.sendFile(path.join(__dirname, "../../client/main.html"));
}

async function submitForm(req, res) {
  try {
    // Handle form validation here
    const { name, age, city, mobile, email } = req.body;

    // Check if required fields are present

    // Get file names
    const resumeFileName = req.files["resume"][0].filename;
    const photoFileName = req.files["photo"][0].filename;

    // Get the user ID generated in server.js
    const userId = req.files["resume"][0].destination.split(path.sep).pop();

    // Create user's folder (This is not necessary as the folder is already created in server.js)
    // const userFolder = path.join(__dirname, "../uploads", userId);
    // fs.mkdirSync(userFolder);

    // Move files to user's folder (This is not necessary as the files are already moved in server.js)
    // fs.renameSync(req.files["resume"][0].path, path.join(userFolder, "resume.pdf"));
    // fs.renameSync(req.files["photo"][0].path, path.join(userFolder, "photo.png"));

    // Save user information to the database using model.js
    const query =
      "INSERT INTO userData (id, name, age, city, mobile, email, resumeFileName, photoFileName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      userId,
      name,
      age,
      city,
      mobile,
      email,
      resumeFileName,
      photoFileName,
    ];
    await model.executeQuery(query, values);
    console.log("above redirection");
    res.redirect("/thankyou");
    console.log("Below redirection");
  } catch (error) {
    console.error("Error processing form data:", error);
    res.status(500).send("Error processing form data.");
  }
}

function sendThanks(req, res) {
  // console.log("Sending thanks");
  res.sendFile(path.join(__dirname, "../../client/thanks.html"));
  // console.log("SENT thanks");
}

module.exports = { displayForm, submitForm, sendThanks };
