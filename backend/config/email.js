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
                pass: process.env.EMAIL_PASS
            }
        })
        console.log("Email transporter initialized");
    }
    return transporter
}

export default getTransporter