import { hashPassword, comparePassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

//Post Registration
//-------------------------------------------------
export const registrationController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    //Validation
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ error: "Email is Required" });
    }
    if (!password) {
      return res.send({ error: "Password is Required" });
    }
    if (!phone) {
      return res.send({ error: "Phone is Required" });
    }
    if (!address) {
      return res.send({ error: "Address is Required" });
    }
    if (!answer) {
      return res.send({ error: "Answer is Required" });
    }

    //Check User Exisiting
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exist, Please login",
      });
    }

    //Hash Password
    const hashedPassword = await hashPassword(password);

    //Save user data in the database
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while register user",
      error,
    });
  }
};

//Post Login
//-------------------------------------------------
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email and password",
      });
    }

    //check user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not register",
      });
    }

    //Match password
    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      return res.status(404).send({
        success: false,
        message: "Invalid password",
      });
    }

    //JWT Token
    const token = await JWT.sign({ _id: user._id }, process.env.SEC_JWT, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully Completed",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while login",
      error,
    });
  }
};

//Forgot Password
//-------------------------------------------------
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, oldpassword, newpassword } = req.body;

    //Validation
    if (!email) {
      return res.send({ error: "Email is required" });
    }
    if (!answer) {
      return res.send({ error: "Answer is required" });
    }
    if (!oldpassword) {
      return res.send({ error: "Old Password is required" });
    }
    if (!newpassword) {
      return res.send({ error: "New Password is required" });
    }

    //Check user by email and answer
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    //Match Password
    const matchedPassword = await comparePassword(oldpassword, user.password);
    if (!matchedPassword) {
      return res.status(404).send({
        success: false,
        message: "Old password is incorrect",
      });
    }

    //hash password
    const hashedPassword = await hashPassword(newpassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
    res.status(200).send({
      success: true,
      message: "Reset password successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while reset forget password",
      error,
    });
  }
};

//Update User
//-------------------------------------------------
export const updateUserController = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ error: "Email is Required" });
    }
    if (!phone) {
      return res.send({ error: "Phone is Required" });
    }
    if (!address) {
      return res.send({ error: "Address is Required" });
    }

    const userInfo = await userModel.findOne({ email });

    const user = await userModel.findByIdAndUpdate(
      userInfo._id,
      {
        name,
        email,
        phone,
        address,
      },
      { new: true }
    );
    await user.save();
    res.status(201).send({
      success: true,
      message: "User Info successfully updated",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating user info",
      error,
    });
  }
};
