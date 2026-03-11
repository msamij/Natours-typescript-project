import { htmlToText } from 'html-to-text';
import nodemailer from 'nodemailer';
import pug from 'pug';
import type { UserModelProps } from '../models/userModel.js';

export class Email {
  constructor(
    private readonly to: string,
    private readonly firstName: string | undefined,
    private readonly url: string,
    private readonly from: string = `Muhammad Sami <${process.env.EMAIL_FROM}>`,
  ) {}

  static create(user: UserModelProps, url: string): Email {
    return new Email(user.email, user.name.split(' ')[0], url);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
  }

  private async send(template: string, subject: string) {
    const html = pug.renderFile(`${import.meta.dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  private newTransport() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Production email transport not configured');
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT as unknown as number,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
}
