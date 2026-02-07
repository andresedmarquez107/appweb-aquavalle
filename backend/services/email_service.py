import resend
import os
import logging

logger = logging.getLogger(__name__)

# Configurar Resend con API key
resend.api_key = os.environ.get("RESEND_API_KEY")

# Email del administrador (único destinatario para recuperación)
ADMIN_EMAIL = "cabanasaquavalle@gmail.com"

# Email remitente
FROM_EMAIL = os.environ.get("FROM_EMAIL", "onboarding@resend.dev")


def send_password_reset_email(reset_code: str) -> bool:
    if not resend.api_key:
        logger.error("RESEND_API_KEY no está configurada")
        return False
    
    try:
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f4; padding: 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px;">
                <h1 style="color: #15803d; text-align: center;">Cabañas AquaValle</h1>
                <h2 style="color: #292524; text-align: center;">Recuperación de Contraseña</h2>
                <p style="text-align: center;">Tu código de recuperación es:</p>
                <div style="background: #f0fdf4; border: 2px solid #15803d; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; color: #15803d; letter-spacing: 8px;">{reset_code}</span>
                </div>
                <p style="text-align: center; color: #78716c;">Este código expira en 15 minutos.</p>
            </div>
        </body>
        </html>
        """
        
        params = {
            "from": FROM_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": "Código de Recuperación - Cabañas AquaValle",
            "html": html_content
        }
        
        response = resend.Emails.send(params)
        logger.info(f"Email enviado: {response}")
        return True
        
    except Exception as e:
        logger.error(f"Error enviando email: {str(e)}")
        return False