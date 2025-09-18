import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const router = Router()
const SECRET = process.env.JWT_SECRET || 'dev'

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ error: 'Email already in use' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hash })
    const token = jwt.sign({ sub: user._id, role: user.role }, SECRET, { expiresIn: '2h' })
    res.json({ token, name: user.name, role: user.role })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'User not found' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Wrong password' })
  const token = jwt.sign({ sub: user._id, role: user.role }, SECRET, { expiresIn: '2h' })
  res.json({ token, name: user.name, role: user.role })
})

export default router
