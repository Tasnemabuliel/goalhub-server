import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// הגנה לכל הראוטר
router.use(authMiddleware, roleMiddleware('superadmin'));

// POST /api/admin/users - יצירת Coach/Player
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password || !phone || !['coach', 'player'].includes(role)) {
      return res.status(400).json({ error: 'יש למלא את כל השדות' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'משתמש כבר קיים' });
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hash,
      phone,
      role,
      isActive: true
    });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'שגיאת שרת' });
  }
});

// GET /api/admin/users?role=coach/player - רשימת משתמשים
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    const filter: any = {};
    if (role && ['coach', 'player'].includes(role as string)) {
      filter.role = role;
    }
    const users = await User.find(filter).select('-password -otpCode -otpExpires -otpAttempts');
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: 'שגיאת שרת' });
  }
});

// DELETE /api/admin/users/:id - מחיקת משתמש
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'שגיאת שרת' });
  }
});

export default router;
