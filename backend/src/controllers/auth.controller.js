import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/index.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    const exitingUser = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (exitingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

   
    return res.status(200).json({
      message: "User created successfully",
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Error creating user",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password){
    return res.status(400).json({
      message:"All fileds are required",
      success: false
    })
  }
  
  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      message: "Error logging in user",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({
      message: "Error logging out user",
      success: false,
    });
  }
};

export const check = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      message: "User authenticated successfully",
      success: true,
      user
    });
  } catch (error) {
    console.error("Error while checking user.", error);
    return res.status(500).json({
      message: "Error while checking user.",
      success: false,
    });
  }
};

export const getAllUser = async (req,res)=>{
  try {
    const allUsers = await db.user.findMany();
    
    if(!allUsers){
      return res.status(404).json({
        success: false,
        message: "No user found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users: allUsers
    })
  } catch (error) {

    console.log("Error while fetching all users from db", error)
    return res.status(500).json({
      success: false,
      message: "Error while fetching all users from db"
    })
  }
}