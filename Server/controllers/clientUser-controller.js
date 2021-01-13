// const User = require("../models/user-model");
const ClientUser = require("../models/clientUser-model");
const clientUserController = {};

/**
 * @route GET api/client-users
 * @description Returns all users
 * @access Public
 */
clientUserController.getAll = async (req, res) => {
  const { username } = req.query;
  const query = req.query;

  try {
    const users = await ClientUser.find(query);

    if (username) {
      return res.status(200).json(users[0]);
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route PUT api/client-users
 * @description Add a new user
 * @access Public
 */
clientUserController.add = async (req, res) => {
  const { email } = req.body;
  try {
    // make sure this account doesn't already exist
    const user = await ClientUser.findOne({ email });

    if (user)
      return res.status(401).json({
        message:
          "The email address you entered is already associated with another account. You can change this users role instead.",
      });

    const newUserToAdd = new ClientUser(req.body);
    const newUser = await newUserToAdd.save();

    res
      .status(200)
      .json({ message: "Add new user successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route GET api/client-users/{id}
 * @description Get a specific user
 * @access Public
 */
clientUserController.get = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await ClientUser.findById(id);

    if (!user) {
      return res.status(401).json({ message: "ClientUser does not exist" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @route PUT api/client-users/{id}
 * @description Update user details (only this user/admin has the access permission to this route)
 * @access Public
 */
clientUserController.update = async (req, res) => {
  try {
    const update = req.body;
    const id = req.params.id;
    const userId = req.user._id;

    // Make sure the passed id is that of the logged in user | or admin can do this directly
    // if (userId.toString() !== id.toString() ) {
    //   return res.status(401).json({
    //     message: "You do not have the permission to update this data",
    //   });
    // }

    // Check if client has uploaded profile image
    if (!req.file) {
      let user = await ClientUser.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true }
      );

      //   if (update.password) {
      //     // if user want to change password
      //     const updatedPasswordUser = await ClientUser(user).save();
      //     user = updatedPasswordUser;
      //   }

      //   if (update.active) {
      //     // if admin want to activate this user
      //     const updatedActiveUser = await ClientUser(user).save();
      //     user = updatedActiveUser;
      //   }

      return res
        .status(200)
        .json({ message: "ClientUser has been updated", user: user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @route DELETE api/client-users/{id}
 * @description Delete user
 * @access Public
 */
clientUserController.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    // // make sure the passed id is that of the logged in user
    // if (userId.toString() !== id.toString()) {
    //   return res.status(401).json({
    //     message: "You do not have the permission to delete this data.",
    //   });
    // }

    const deletedUser = await ClientUser.findByIdAndDelete(id);
    res.status(200).json({
      message: "ClientUser has been deleted.",
      deletedUser: deletedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = clientUserController;
