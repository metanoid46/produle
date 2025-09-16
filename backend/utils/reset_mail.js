import nodemailer from "nodemailer";

export async function sendResetMail(userMail, code) {
  const transporter = nodemailer.createTransport({
    host:process.env.BREVO_HOST,
    port:process.env.BREVO_PORT,
    secure:false,
    auth: {
      user: process.env.BREVO_LOGIN,
      pass: process.env.BREVO_PASS,
    },
  });

   try {
    const info=await transporter.sendMail({
      from: `"Produle" <${process.env.BREVO_USER}>`,
      to: userMail,
      subject: "Reset Password",
      text: `Your Reset code is: ${code}`,
      html: `<p>Your Reset code is: <b>${code}</b></p>`,
  });
    console.log("Email sent!"+ userMail+code);
    console.log(info);
  } catch (err) {
    console.error("Send failed:", err);
  }

}
