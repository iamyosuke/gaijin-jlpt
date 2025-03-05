import nodemailer from 'nodemailer';

// SMTPサーバーの設定
const transporter = nodemailer.createTransport({
  service: 'gmail', // 使用するメールサービス（例: Gmail）
  auth: {
    user: process.env.GMAIL_USER, // 環境変数からメールアドレスを取得
    pass: process.env.GMAIL_PASSWORD  // 環境変数からパスワードを取得
  }
});

// メール送信関数
export const sendMail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('メールが送信されました: ' + info.response);
  } catch (error) {
    console.error('エラーが発生しました: ', error);
  }
};