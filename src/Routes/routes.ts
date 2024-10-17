import { Router } from "express";
import { sendMessageController } from "../Controllers/controller";
import { getLunchCountData } from "../Services/services";

const router = Router();

router.post("/send", sendMessageController);
router.get("/count",getLunchCountData)

export default router;
