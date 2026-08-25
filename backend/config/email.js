import { Resend } from 'resend'

let resend = null

export const getResend = () => {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)

    console.log('📧 Resend initialized')
  }

  return resend
}

export default getResend