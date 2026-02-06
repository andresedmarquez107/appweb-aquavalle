from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

# Import routes
from routes import reservations, rooms, availability, admin
from database import SupabaseClient

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(
    title="Cabañas AquaValle API",
    description="API for managing reservations at Cabañas AquaValle",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check
@api_router.get("/")
async def root():
    return {
        "message": "Cabañas AquaValle API",
        "status": "running",
        "version": "1.0.0"
    }

# Include route modules
api_router.include_router(reservations.router)
api_router.include_router(rooms.router)
api_router.include_router(availability.router)
api_router.include_router(admin.router)

# Include the router in the main app
app.include_router(api_router)
# ... importaciones anteriores ...

# Lista de orígenes permitidos (La "Lista de Invitados")
origins = [
    "http://localhost:3000",  # Para que funcione en tu PC
    "http://127.0.0.1:3000",  # Alternativa local por si acaso
    "https://appweb-aquavalle.vercel.app" # Tu URL de Vercel
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Aquí usamos la lista específica, NO ["*"]
    allow_credentials=True,
    allow_methods=["*"],    # Permitir todos los métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"],    # Permitir todos los headers
)



# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    # Supabase client doesn't require explicit cleanup
    logger.info("Application shutdown complete")