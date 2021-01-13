const express = require("express");
const router = express.Router();
const clientUserController = require("../controllers/clientUser-controller");

/* GET users listing. */
router.get("/", clientUserController.getAll);
// router.post("/", clientUserController.add);
router.get("/:id", clientUserController.get);
router.put("/:id", clientUserController.update); // update user's active status | only user can update their password
router.delete("/:id", clientUserController.delete);

module.exports = router;
