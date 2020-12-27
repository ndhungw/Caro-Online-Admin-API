const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const validate = require("../middlewares/validate");
const authController = require("../controllers/auth-controller");
const passwordController = require("../controllers/password-controller");
const authenticate = require("../middlewares/authenticate");

router.get("/", authenticate, (req, res) => {
  res
    .status(200)
    .json({ user: req.user, message: "You are in the Auth Endpoint." });
});

// REGISTER
router.post(
  "/register",
  [
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("username").not().isEmpty().withMessage("Your username is required"),
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Must be at least 6 characters long"),
  ],
  validate,
  authController.register
);

// LOGIN
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password").not().isEmpty(),
  ],
  validate,
  authController.login
);

// PASSWORD RECOVER: create a 'recover password request' and send it to user email
router.post(
  "/recover",
  [check("email").isEmail().withMessage("Enter a valid email address")],
  validate,
  passwordController.recover
);

// router.get("/reset/:token", passwordController.geResetView);

// PASSWORD RESET: reset password with 'password' and 'confirmPassword' fields
router.post(
  "/reset/:token",
  [
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Must be at least 6 chars long"),
    check("confirmPassword", "Passwords do not match").custom(
      (value, { req }) => value === req.body.password
    ),
  ],
  validate,
  passwordController.resetPassword
);

router.post("/activate/:activationToken", authController.activate);
module.exports = router;
