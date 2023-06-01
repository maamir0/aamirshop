const nodemailer = require("nodemailer");

class Mail {
  #transporter;
  constructor() {
    this.#transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "abb2b824173412",
        pass: "b67ef371224669",
      },
    });
  }

  async sendOTP(to, otp) {
    await this.#transporter.sendMail({
      from: '"Hannan Shoukat 👻" <hannan@example.com>', // sender address
      to: to, // list of receivers
      subject: "Verify your account", // Subject line
      text: `Your OTP is ${otp},this is valid for 10 minutes`, // plain text body
      html: `<b>Your OTP is ${otp},this is valid for 10 minutes</b>`,
    });
  }
}

module.exports = Mail;
