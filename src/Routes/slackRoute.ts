import { Router } from "express";
import { sendMessageController } from "../Controllers/sendMessage";
import { getLunchCountDataController } from "../Controllers/getLunchCountData";
import { getExceldataController } from "../Controllers/getExceldata";
const router = Router();

router.post("/send", sendMessageController);
router.get("/count", getLunchCountDataController);
router.post("/report", getExceldataController);

export default router;
