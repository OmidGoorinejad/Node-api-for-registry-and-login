const express = require("express");
const homeRoutre = require("../controller/home-controller");
const router = express.Router();

router.get("/", homeRoutre);

module.exports = router;