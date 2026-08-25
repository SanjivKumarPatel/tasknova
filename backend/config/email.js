import nodemailer from 'nodemailer'

let transporter = null

export const getTransporter = () => {
  if (!transporter) {
    const port = Number(process.env.EMAIL_PORT)

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    console.log('📧 Email transporter initialized')

    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter verification failed:')
        console.error('Code:', error.code)
        console.error('Command:', error.command)
        console.error('Response:', error.response)
        console.error('Message:', error.message)
      } else {
        console.log('✅ Email server ready:', success)
      }
    })
  }

  return transporter
}

export default getTransporter