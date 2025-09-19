import nodemailer from 'nodemailer';

// Configuração do PHPMailer-style usando nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Verifica se o transporter está configurado corretamente
 */
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email service configuration error:', error);
    return false;
  }
}

/**
 * Envia e-mail de redefinição de senha
 */
export async function sendPasswordResetEmail(
  to: string,
  token: string
): Promise<void> {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5000'}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'Sistema'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: to,
    subject: 'Redefinição de senha',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Redefinição de Senha</h2>
        <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
        <div style="margin: 20px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Redefinir Senha
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Este link é válido por 30 minutos. Se você não solicitou esta redefinição, 
          ignore este e-mail.
        </p>
        <p style="color: #666; font-size: 12px;">
          Se o botão não funcionar, copie e cole este link no seu navegador:<br>
          ${resetUrl}
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', to);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Falha ao enviar e-mail de redefinição');
  }
}