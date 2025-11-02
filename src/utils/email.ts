import nodemailer from 'nodemailer';

const sendEmail = (options: any) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    // (port property defined as number | undefined), to make typescript happy I am aliasing it as a number.
    port: process.env.EMAIL_PORT as unknown as number,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Muhammad Sami <msamiaj20@gmail.com>',
    to: options.email,
  };
};
