import jwt from 'jsonwebtoken'

const generateToken = (id, role= 'member', expiresIn = '7d') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn
  })
}

export default generateToken
