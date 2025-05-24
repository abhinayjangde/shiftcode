import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token)
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized - No token provided",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - User not found",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true
      },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied - Admin only"
      });

    }

    next();
  } catch (error) {
    console.error("Error checking admin role ", error);
    return res.status(500).json({
      success: false,
      message: "Error checking admin role",
    });
  }
};
