// const express = require("express");
// const router = express.Router();
// const app = require("../server.js");
// const path = require("path");

// // app.get("/form", function (req, res) {
// //   res.sendFile(path.join(__dirname, "../../client/main.html"));
// // });
// const controller = require("../controllers/controller.js");

// router.get("/api/users", controller.displayForm);

// router.post("/api/users", controller.submitForm);

// router.get("/thankyou", controller.sendThanks);

// module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.js");

router.get("/api/users/", controller.displayForm);

router.post("/api/users/", controller.submitForm);

router.get("/thankyou", controller.sendThanks);

module.exports = router;
