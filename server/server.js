const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const model = require("./models/model"); // Import the model.js file
const routes = require("./routes/route"); // Import the route.js file

const port = 80;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "client")));

// Create multer instance to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.generatedUserId; // Get the generated user ID from the request object
    const userFolder = path.join(__dirname, "uploads", userId);

    // Check if the folder already exists
    if (!fs.existsSync(userFolder)) {
      ensureFolderExists(userFolder); // Ensure the user's folder exists
    }

    cb(null, userFolder); // Set the destination folder for uploaded files
  },

  filename: (req, file, cb) => {
    // Rename the uploaded files to 'resume.pdf' and 'photo.png'
    const originalName = file.originalname;
    if (originalName.endsWith(".pdf") || originalName.endsWith(".docx")) {
      cb(null, "resume.pdf");
    } else if (originalName.endsWith(".png")) {
      cb(null, "photo.png");
    } else {
      cb(new Error("Invalid file format"));
    }
  },
});

const upload = multer({ storage });

// Load the last used user ID from the text file, if available
let lastUserId = 0; // Initialize the lastUserId counter
try {
  const data = fs.readFileSync("lastUserId.txt", "utf8");
  lastUserId = parseInt(data) || 0;
} catch (error) {
  // Ignore errors if the file doesn't exist or cannot be read
}

function generateUniqueUserId() {
  lastUserId++; // Increment the last used user ID for the next user
  const nextUserId = lastUserId.toString().padStart(5, "0"); // Convert to format USR00001
  fs.writeFileSync("lastUserId.txt", lastUserId.toString(), "utf8"); // Save the updated lastUserId to the file
  const userId = "USR" + nextUserId;
  console.log("Generated User ID:", userId); // Debug statement
  return userId;
}

// Helper function to ensure the folder exists for the user
function ensureFolderExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

// Define the route to handle the form submission
app.post(
  "/api/users",
  (req, res, next) => {
    req.generatedUserId = generateUniqueUserId(); // Generate unique user ID and attach to request object
    next();
  },
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Handle form validation and saving user data to the database here
      const { name, age, city, mobile, email } = req.body;

      const resumeFileName = req.files["resume"][0].filename;
      const photoFileName = req.files["photo"][0].filename;

      const userId = req.generatedUserId; // Get the generated user ID from the request object

      // Create user's folder (already handled by the destination function)

      // Move files to user's folder (already handled by the destination function)

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

      // Respond to the client
      res.redirect("/thankyou");
    } catch (error) {
      console.error("Error processing form data:", error);
      res.status(500).send("Error processing form data.");
    }
  }
);

app.use(routes); // Use the routes defined in route.js

app.listen(port, () => {
  console.log("Last User ID:", lastUserId); // Debug statement
  console.log(`Listening on ${port}....`);
});
