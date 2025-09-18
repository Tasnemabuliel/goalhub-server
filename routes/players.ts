import { Router } from 'express'
import type { Request, Response } from 'express'
import Player from '../models/Player'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const players = await Player.find()
  res.json(players)
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const player = await Player.create(req.body)
    res.json(player)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
})

export default router

