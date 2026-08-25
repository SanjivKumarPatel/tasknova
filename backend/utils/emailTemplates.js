export const resetOtpTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html lang='en'>
    <head>
      <meta charset='UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
      <title>TaskNova - Password Reset</title>
    </head>
    <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background: rgb(248,250,252);'>
      
      <div style='font-family: Arial, sans-serif; background: rgb(248,250,252); padding: 20px;'>
        <div style='max-width: 600px; margin: auto; background: white; border-radius: 16px; padding: 35px 25px; border: 1px solid rgb(226,232,240);'>

          <h1 style='margin-top: 0; color: rgb(37,99,235); text-align: center; font-size: 32px;'>
            TaskNova
        </h1>

        <h2 style='color: rgb(15,23,42); margin-top: 30px; font-size: 22px;'>
          Hello ${name},
        </h2>
        
        <p style='color: rgb(71, 85, 105); line-height: 1.7; font-size: 15px;'>
          We received a request to reset your password.
          Use the OTP below to continue.
        </p>

        <div style='background: rgb(239,246,255); padding: 25px; border-radius: 14px; text-align: center; margin: 30px 0;'>
          <p style='margin: 0; font-size: 13px; color: rgb(100,116,139); font-weight: 600; text-transform: uppercase; letter-spacing: 1px;'>
            PASSWORD RESET OTP
          </p>

          <h1 style='margin: 15px 0 0; font-size: 42px; letter-spacing: 8px; color: rgb(37, 99, 235); font-family: monospace; font-weight: 700;'>
            ${otp}
          </h1>

          </div>

          <p style='color: rgb(220,38,38); font-size: 14px; font-weight: 600; margin: 0;'>
           ⏱ OTP expires in 5 minutes
          </p>

          <p style='font-size: 14px; color: rgb(100,116,139); margin-top: 25px; line-height: 1.6;'>
            If you didn't request this, please ignore this email.
          </p>

        </div>
    </div>

</body>
</html>
`
}
