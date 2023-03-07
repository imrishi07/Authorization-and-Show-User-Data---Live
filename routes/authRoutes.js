import express from "express";
import {
  registrationController,
  loginController,
  forgotPasswordController,
  updateUserController,
} from "../controller/authController.js";

//Routing
const router = express.Router();

// 📍 Register || Method - POST
router.post("/register", registrationController);

// 📍 Login || Method - POST
router.post("/login", loginController);

// 📍 Forgot Password || Method - POST
router.post("/forgot-password", forgotPasswordController);

// 📍 Update Info || Method - PUT
router.put("/update-user", updateUserController);

export default router;
