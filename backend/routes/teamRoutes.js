import express from 'express'
import protect from '../middleware/authMiddleware.js'
import {
  createTeam,
  getAllTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember
} from '../controllers/teamController.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const teamRouter = express.Router()

teamRouter.use(protect)

teamRouter.get('/', getAllTeams)

teamRouter.post('/', adminMiddleware, createTeam)
teamRouter.get('/:id', getTeam)
teamRouter.get('/:id/members', getTeam)
teamRouter.put('/:id', adminMiddleware, updateTeam)
teamRouter.post('/:id/members', adminMiddleware, addMember)
teamRouter.delete('/:id/members/:memberId', adminMiddleware, removeMember)
teamRouter.delete('/:id', adminMiddleware, deleteTeam)

export default teamRouter
