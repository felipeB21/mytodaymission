import { Router } from "express";
const router = Router();

import { findUserByUsername } from "../controller/users.controller.js";

router.get("/:username", findUserByUsername);

export default router;
