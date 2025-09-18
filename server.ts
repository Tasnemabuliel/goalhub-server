import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import authRoutes from './routes/auth'
import playersRoutes from './routes/players'

dotenv.config()
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.resolve(__dirname, '.env') })
}
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') })
}

const app = express()
app.use(cors())
app.use(express.json())

const mongoUri = process.env.MONGO_URI
if (!mongoUri) {
  console.error('MONGO_URI is missing. Set it in server/.env')
  process.exit(1)
}

const dbName = process.env.DB_NAME
mongoose.connect(mongoUri, dbName ? { dbName } : undefined)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err: any) => {
    console.error('❌ Mongo Error:', err?.message || err)
    process.exit(1)
  })

app.get('/', (_req, res) => res.json({ ok: true, service: 'GoalHub API' }))
app.use('/api/auth', authRoutes)
app.use('/api/players', playersRoutes)

app.listen(4000, () => console.log('🚀 API running on http://localhost:4000'))
