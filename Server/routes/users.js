const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controllers");

/* GET users listing. */
router.get("/", userController.getAll);
router.post("/", userController.add);
router.get("/:id", userController.get);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

module.exports = router;
