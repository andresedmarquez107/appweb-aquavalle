import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

class Settings:
    # Supabase
    SUPABASE_URL: str = os.getenv('SUPABASE_URL', '')
    SUPABASE_ANON_KEY: str = os.getenv('SUPABASE_ANON_KEY', '')
    SUPABASE_SERVICE_KEY: str = os.getenv('SUPABASE_SERVICE_KEY', '')
    
    # WhatsApp
    WHATSAPP_NUMBER: str = '584247739434'
    
    # Full Day
    FULLDAY_PRICE: float = 5.0
    MAX_FULLDAY_CAPACITY: int = 20
    
    # JWT Secret
    SECRET_KEY: str = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

settings = Settings()
