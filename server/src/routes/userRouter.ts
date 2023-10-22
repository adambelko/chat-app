import express from "express";
const router = express.Router();

import { refreshToken_post } from "../controllers/userController";

router.post("/refresh-token", refreshToken_post);

export default router;
