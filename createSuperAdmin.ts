import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import User from './models/User'

dotenv.config()

async function run() {
  await mongoose.connect(process.env.MONGO_URI!)
  // מוחק את כל הסופר־אדמינים הקודמים
  await User.deleteMany({ role: 'superadmin' })
  const hash = await bcrypt.hash('GoalHub1234', 10)
  const user = await User.create({
    name: 'Super Admin',
    email: 'superadmin@goalhub.com',
    password: hash,
    role: 'superadmin',
    phone: '+972501234567',
    isActive: true,
    otpAttempts: 0
  })
  console.log('✅ SuperAdmin created:', user.email)
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
