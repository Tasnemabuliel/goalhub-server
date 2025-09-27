import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SuperAdmin from "../models/SuperAdmin"; // לא מומלץ לשים .ts
import { sendCode } from "../services/sms";

const router = Router();

// ✅ הרשמה של סופר אדמין
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newSuperAdmin = await SuperAdmin.create({ name, phone, passwordHash });
    res.json({ success: true, superAdmin: newSuperAdmin._id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ בקשה לשליחת קוד התחברות (OTP)
router.post("/login/request", async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await SuperAdmin.findOne({ phone });
    if (!user) return res.status(404).json({ error: "SuperAdmin not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // שמירת קוד בזיכרון זמני (בפועל מומלץ Redis/DB זמני)
    req.app.locals.codes = req.app.locals.codes || {};
    req.app.locals.codes[phone] = code;

    await sendCode(phone, code); // שליחת SMS
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ אימות קוד וקבלת JWT
router.post("/login/verify", async (req, res) => {
  try {
    const { phone, code } = req.body;
    const valid = req.app.locals.codes?.[phone] === code;
    if (!valid) return res.status(400).json({ error: "Invalid code" });

    const user = await SuperAdmin.findOne({ phone });
    if (!user) return res.status(404).json({ error: "SuperAdmin not found" });

    const token = jwt.sign(
      { id: user._id, role: "SUPERADMIN" },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
