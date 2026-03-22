import { Injectable } from '@nestjs/common';
import sgMail = require('@sendgrid/mail');

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendLoginNotification(email: string) {
    const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: '【社内システム】ログイン通知',
      text: `ログインが検出されました。\n\n日時: ${now}\nメールアドレス: ${email}\n\n身に覚えのない場合はパスワードを変更してください。`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">ログイン通知</h2>
          <p>以下のアカウントでログインが検出されました。</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">日時</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${now}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">メールアドレス</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
            </tr>
          </table>
          <p style="color: #888; font-size: 12px;">身に覚えのない場合はパスワードを変更してください。</p>
        </div>
      `,
    };

    await sgMail.send(msg);
  }
}
