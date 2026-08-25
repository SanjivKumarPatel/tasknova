import asyncHandler from '../middleware/asyncHandler.js'
import Team from '../models/Team.js'
import { getSocket } from '../utils/socket.js'

export const createTeam = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { name, description } = req.body
  if (!name || !name.trim()) {
    const error = new Error('Team name is required')
    error.statusCode = 400
    throw error
  }

  const team = await Team.create({
    name: name.trim(),
    description,
    createdBy: userId,
    members: [userId]
  })

  const populatedTeam = await Team.findById(team._id).populate('createdBy members', 'name email')
  const io = getSocket()

  io.to(`user:${userId}`).emit('team-created', {
    team: populatedTeam
  })

  res.status(201).json({
    success: true,
    message: 'Team created successfully',
    team: populatedTeam
  })
})

export const getAllTeams = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const query =
    req.user.role === 'admin'
      ? {}
      : { members: userId }

  const teams = await Team.find(query)
    .populate('createdBy members', 'name email')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: teams.length,
    teams
  })
})

export const getTeam = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const teamId = req.params.id

  const team = await Team.findById(teamId).populate('createdBy members', 'name email')
  

  if (!team) {
    const error = new Error('Team not found')
    error.statusCode = 404
    throw error
  }

  const isAdmin = req.user.role === 'admin'

  const isMember = team.members.some((member) => member._id.toString() === userId)

  if (!isAdmin && !isMember) {
    const error = new Error('You are not authorized to access this team')
    error.statusCode = 403
    throw error
  }

  res.status(200).json({ success: true, team })
})

export const updateTeam = asyncHandler(async (req, res) => {
  const teamId = req.params.id

  let team = await Team.findById(teamId)
  
  if (!team) {
    const error = new Error('Team not found')
    error.statusCode = 404
    throw error
  }

  if (req.user.role !== 'admin') {
    const error = new Error('Only admin can update teams')
    error.statusCode = 403
    throw error
  }

  const { name, description, status } = req.body

  if (name) team.name = name.trim()
  if (description !== undefined) team.description = description
  if (status) team.status = status

  await team.save()
  team = await Team.findById(teamId).populate('createdBy members', 'name email')
  const io = getSocket()

  team.members.forEach((member) => {
    io.to(`user:${member._id.toString()}`).emit('team-updated', {
     team
    })
  })

  res.status(200).json({
    success: true,
    message: 'Team updated successfully',
    team
  })
})

export const deleteTeam = asyncHandler(async (req, res) => {
  const teamId = req.params.id

  const team = await Team.findById(teamId)

  if (!team) {
    const error = new Error('Team not found')
    error.statusCode = 404
    throw error
  }
  if (req.user.role !== 'admin') {
    const error = new Error('Only admin can delete teams')
    error.statusCode = 403
    throw error
  }

  const memberIds = team.members.map((member) => member.toString())

  await team.deleteOne()

  const io = getSocket()

  memberIds.forEach((memberId) => {
    io.to(`user:${memberId}`).emit('team-deleted', {
      teamId
    })
  })

  res.status(200).json({
    success: true,
    message: 'Team deleted successfully'
  })
})

export const addMember = asyncHandler(async (req, res) => {
  const teamId = req.params.id
  const { memberId } = req.body
  if (!memberId) {
    const error = new Error('Member ID is required')
    error.statusCode = 400
    throw error
  }

  let team = await Team.findById(teamId)

  if (!team) {
    const error = new Error('Team not found')
    error.statusCode = 404
    throw error
  }
  if (req.user.role !== 'admin') {
    const error = new Error('Only admin can add members')
    error.statusCode = 403
    throw error
  }

  const exists = team.members.some(
    (member) => member.toString() === memberId
  )
  if (exists) {
    const error = new Error('This user is already a team member')
    error.statusCode = 400
    throw error
  }

  team.members.push(memberId)
  await team.save()
  
  team = await Team.findById(teamId).populate('createdBy members', 'name email')
  const io = getSocket()

  team.members.forEach((member) => {
    io.to(`user:${member._id.toString()}`).emit('team-updated', {
      team
    })
  })

  res.status(200).json({
    success: true,
    message: 'Team member added successfully',
    team
  })
})

export const removeMember = asyncHandler(async (req, res) => {
  const teamId = req.params.id
  const memberId = req.params.memberId

  let team = await Team.findById(teamId)

  if (!team) {
    const error = new Error('Team not found')
    error.statusCode = 404
    throw error
  }

  if (req.user.role !== 'admin') {
    const error = new Error('Only admin can remove members')
    error.statusCode = 403
    throw error
  }

  const exists = team.members.some(
  (member) => member.toString() === memberId
 )

  if (!exists) {
    const error = new Error('User is not a team member')
    error.statusCode = 404
    throw error
  }

  team.members = team.members.filter((member) => member.toString() !== memberId)
  await team.save()
  
  team = await Team.findById(teamId).populate('createdBy members', 'name email')
  const io = getSocket()

  io.to(`user:${memberId}`).emit('team-updated', {
    team
  })

  team.members.forEach((member) => {
    io.to(`user:${member._id.toString()}`).emit('team-updated', {
      team
    })
  })

  res.status(200).json({
    success: true,
    message: 'Team member removed successfully',
    team
  })
})
