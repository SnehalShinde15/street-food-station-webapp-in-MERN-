import express from "express";
import { loginUser, registerUser , googleLogin, getAllUsers, deleteUser} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);

userRouter.post("/google-login", googleLogin);
//userRouter.post("/admin-login", adminLogin);


userRouter.get("/", getAllUsers);
userRouter.delete("/:id", deleteUser);

export default userRouter;
