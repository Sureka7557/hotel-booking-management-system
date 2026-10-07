import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser,getUserStats 
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", createUser);
router.get("/verifyauthentication",verifyToken,(req,res,next)=>{
  res.send("Hello user,you are authenticated")
})
router.get("/verifyuser/:id",verifyUser,(req,res,next)=>{
  res.send("Hello user,you are log in, you can delete ur account")
})
router.get("/verifyadmin/:id",verifyAdmin,(req,res,next)=>{
  res.send("Hello admin,you are log in, you can delete ur account")
})
// UPDATE USER
router.put("/:id",verifyUser, updateUser);

// DELETE USER
router.delete("/:id", verifyUser, deleteUser);

// GET SINGLE USER
router.get("/:id", getUser);

// GET ALL USERS
router.get("/",verifyAdmin, getUsers);

router.get("/userStats/:userId", getUserStats);


export default router;