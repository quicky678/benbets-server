const pool = require("../db/db");

const createUser = async (req, res) => {
  try {
    const { username, email, category } = req.body;

    // Check if user with the same email already exists
    const checkUserQuery = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );

    if (checkUserQuery.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Add user to the database if not found
    const addUserQuery = await pool.query(
      "INSERT INTO users (user_name, user_email, user_category) VALUES ($1, $2, $3)",
      [username, email, category]
    );
    // Retrieve the newly created user using their unique email
    const newUserQuery = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );

    const createdUser = newUserQuery.rows[0]; // Extract the first row as the created user

    res
      .status(201)
      .json({ message: "User created successfully", user: createdUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { user_id, username, email, category } = req.body;

    const updateUserQuery = await pool.query(
      `UPDATE users SET user_name=$1, user_email=$2, user_category=$3 WHERE user_id=$4`,
      [username, email, category, user_id]
    );

    if (updateUserQuery.rowCount > 0) {
      res.status(200).json({
        message: "User updated successfully",
        user: {
          user_id: user_id,
          user_name: username,
          user_email: email,
          user_category: category,
        },
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const deleteUserQuery = await pool.query(
      `DELETE FROM users WHERE user_id=$1`,
      [user_id]
    );

    if (deleteUserQuery.rowCount > 0) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const getUsersQuery = await pool.query("SELECT * FROM users");

    const users = getUsersQuery.rows;
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
};
