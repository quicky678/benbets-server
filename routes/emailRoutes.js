const express = require("express");
const sendBulkEmailsController = require("../controllers/sendBulkEmailsController");

const router = express.Router();

router.post("/send-email", sendBulkEmailsController.sendBulkEmails);
router.get("/email-audit", sendBulkEmailsController.getTodaysEmailAudit);

module.exports = router;
