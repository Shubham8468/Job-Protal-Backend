import nodeMailer from "nodemailer"
export const sendMail= async ({email,subject,message,html})=>{
    const host = process.env.SMTP_HOST || process.env.SMPT_HOST;
    const service = process.env.SMTP_SERVICE || process.env.SMPT_SERVICE;
    const port = Number(process.env.SMTP_PORT || process.env.SMPT_PORT || 465);
    const password = process.env.SMTP_PASSWORD || process.env.SMPT_PASSWORD;

    const transporter= nodeMailer.createTransport({
        host,
        service,
        port,
        secure: port === 465,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:password,
        },
    })
    const options={
        from:process.env.SMTP_MAIL,
        to:email,
        subject:subject,
        text:message,
        html
    }
    await transporter.sendMail(options);
}