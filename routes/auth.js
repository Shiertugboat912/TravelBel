const express = require("express");
const user = require("../controllers/login_register");
const router = express.Router();

router.post("/register", user.register);

router.post("/login", user.login);

router.get("/profile", user.authMiddleware, function (req, res) {
  console.log("authenticated");
  res.json({ access: true });
});

module.exports = router;
