const express = require("express");

const searchController = require("../controllers/search.controllers");

const router = express.Router();

router.get("/", searchController.getSearchResults);

module.exports = router;
