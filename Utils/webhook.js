const express = require("express");
const router = express.Router();
const transactionRepo = require("../Repository/transactionRepo");

router.post(
  "/",
  express.json({ type: "application/json" }),
  async (req, res) => {
    const event = req.body;
    if (event.type === "checkout.session.completed") {
      const sessionId = event.data.object.id;
      const status = event.data.object.payment_status;
      const amount_total = event.data.object.amount_total;
      await transactionRepo.updateTransactionStatus(
        sessionId,
        status,
        amount_total
      );
    }
    return res.json({ received: true });
  }
);

module.exports = router;
