import axios from 'axios'

const apiInstance = axios.create({
  baseURL: 'https://tasknova-7qz0.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add JWT automatically
apiInstance.interceptors.request.use(
  (config) => {
    const token =
  localStorage.getItem('token') ||
  sessionStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

const api = {
  get: (url, config) => apiInstance.get(url, config),
  post: (url, data, config) => apiInstance.post(url, data, config),
  put: (url, data, config) => apiInstance.put(url, data, config),
  delete: (url, config) => apiInstance.delete(url, config)
}

export const authApi = {
  registerUser: (name, email, password, role) =>
    api.post('/auth/register', { name, email, password, role }),

  login: (email, password, rememberMe) =>
    api.post('/auth/login', { email, password, rememberMe }),

  getProfile: () =>
    api.get('/auth/profile'),

  updateProfile: (name, email, password) =>
    api.put('/auth/profile', { name, email, password }),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  verifyOtp: (email, otp) =>
    api.post('/auth/verify-otp', { email, otp }),

  resetPassword: (email, password, confirmPassword) =>
    api.post('/auth/reset-password', {
      email,
      password,
      confirmPassword
    }),

  getUsers: () =>
    api.get('/auth/users'),

  deleteProfile: () =>
    api.delete('/auth/profile'),
}

export const taskApi = {
  createTask: (
    title,
    description,
    deadline,
    priority,
    category,
    assignedTo
  ) =>
    api.post('/tasks', {
      title,
      description,
      deadline,
      priority,
      category,
      assignedTo
    }),

  getAllTasks: () =>
    api.get('/tasks'),

  getTask: (taskId) =>
    api.get(`/tasks/${taskId}`),

  updateTask: (
    taskId,
    title,
    description,
    deadline,
    priority,
    category,
    status
  ) =>
    api.put(`/tasks/${taskId}`, {
      title,
      description,
      deadline,
      priority,
      category,
      status
    }),

  deleteTask: (taskId) =>
    api.delete(`/tasks/${taskId}`),

  generateSubtasks: (taskId, title, description) =>
    api.post(`/tasks/${taskId}/generate-subtasks`, {
      title,
      description
    })
}

export const teamApi = {
  createTeam: (name, description) =>
    api.post('/teams', { name, description }),

  getAllTeams: () =>
    api.get('/teams'),

  getTeam: (teamId) =>
    api.get(`/teams/${teamId}`),

  updateTeam: (teamId, name, description, status) =>
    api.put(`/teams/${teamId}`, {
      name,
      description,
      status
    }),

  deleteTeam: (teamId) =>
    api.delete(`/teams/${teamId}`),

  addMember: (teamId, memberId) =>
    api.post(`/teams/${teamId}/members`, { memberId }),

  removeMember: (teamId, memberId) =>
    api.delete(`/teams/${teamId}/members/${memberId}`)
}

export const notificationApi = {
  getAllNotification: () =>
    api.get('/notifications'),

  getNotification: (notificationId) =>
    api.get(`/notifications/${notificationId}`),

  markAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),

  markAllAsRead: () =>
    api.put('/notifications/mark-all-read'),

  deleteNotification: (notificationId) =>
    api.delete(`/notifications/${notificationId}`)
}

export default api