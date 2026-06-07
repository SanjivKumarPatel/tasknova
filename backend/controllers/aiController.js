import asyncHandler from '../middleware/asyncHandler.js'
import { aiResponse } from '../config/ai.js'
import Task from '../models/Task.js'

export const generateSubtasks = asyncHandler(async (req, res) => {
  const taskId = req.params.id
  const { title, description } = req.body

  if (!taskId || !title || !description) {
    return res.status(400).json({message: 'Missing required fields'})
  }

  const task = await Task.findById(taskId)

  if (!task) {
    return res.status(404).json({message: 'Task not found'})
  }


  const fullPrompt = ` You are a project management expert.
  Break down this task into actionable subtasks.
  Task Title: "${title}"
  Task Description: "${description}"
  Provide a JSON array of subtasks with this structure:
  [
    {
      "title": "subtask name",
      "description": "brief description",
      "priority": "low",
      "estimatedTime": "1 hour"
    }
  ]

  Requirements:
  1. Generate 3-7 specific actionable subtasks
  2. Keep descriptions concise
  3. Assign realistic priorities
  4. Return ONLY valid JSON
`
  const response = await aiResponse(fullPrompt)
  console.log('AI RESPONSE:')
  console.log('====================')
  console.log(response)
  console.log('====================')

  let subtasks

 try {
  const jsonMatch = response.match(/\[[\s\S]*\]/)

  if (!jsonMatch) {
    return res.status(500).json({message: 'Failed to extract JSON'})
  }

  subtasks = JSON.parse(jsonMatch[0])
} catch (error) {
  return res.status(500).json({message: 'Failed to parse AI response'})
}

  if (!Array.isArray(subtasks)) {
    return res.status(500).json({message: 'Invalid subtasks format'})
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, { subtasks }, { new: true }).populate('createdBy assignedTo', 'name email')

  res.status(200).json({success: true, message: 'Subtasks generated successfully', task: updatedTask})
})