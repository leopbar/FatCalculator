
import nodemailer from 'nodemailer';

// Configuração do transporter
const transporter = nodemailer.createTransporter({
  // Para desenvolvimento, use um serviço como Ethereal Email
  // Para produção, configure com seu provedor (Gmail, SendGrid, etc.)
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER || 'ethereal.user@example.com',
    pass: process.env.SMTP_PASS || 'ethereal.pass'
  }
});

/**
 * Envia e-mail de redefinição de senha
 * @param email - E-mail do destinatário
 * @param resetToken - Token para redefinição
 * @param baseUrl - URL base da aplicação
 */
export async function sendPasswordResetEmail(
  email: string, 
  resetToken: string, 
  baseUrl: string = process.env.BASE_URL || 'http://localhost:5000'
): Promise<void> {
  try {
    console.log(`📧 Enviando e-mail de reset para: ${email}`);
    
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@seusite.com',
      to: email,
      subject: 'Redefinição de senha',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Redefinição de senha</h2>
          
          <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
          
          <div style="margin: 30px 0;">
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
            <span style="background: #f5f5f5; padding: 5px; border-radius: 3px;">${resetUrl}</span>
          </p>
        </div>
      `,
      text: `
        Redefinição de senha
        
        Você solicitou a redefinição de sua senha. 
        
        Acesse este link para criar uma nova senha: ${resetUrl}
        
        Este link é válido por 30 minutos. Se você não solicitou esta redefinição, ignore este e-mail.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ E-mail enviado com sucesso:', info.messageId);
    
    // Para desenvolvimento com Ethereal, mostra o preview
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
  } catch (error) {
    console.error('💥 Erro ao enviar e-mail:', error);
    throw new Error('Falha ao enviar e-mail de redefinição');
  }
}

/**
 * Verifica se o serviço de e-mail está configurado corretamente
 */
export async function verifyEmailService(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✅ Serviço de e-mail configurado corretamente');
    return true;
  } catch (error) {
    console.error('❌ Erro na configuração do e-mail:', error);
    return false;
  }
}
