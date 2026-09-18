import logging
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models import ALL_MODELS

logger = logging.getLogger(__name__)

class DatabaseManager:
    client: AsyncIOMotorClient = None
    db_name: str = settings.MONGODB_DB_NAME

    async def connect(self):
        try:
            logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=5000
            )
            # Test connection
            await self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB server.")

            # Compatibility shim: Prevent Motor __getattr__ database lookup if Beanie calls append_metadata
            try:
                setattr(self.client, "append_metadata", lambda *args, **kwargs: None)
            except Exception:
                pass

            # Initialize Beanie ODM
            await init_beanie(
                database=self.client[self.db_name],
                document_models=ALL_MODELS
            )

            logger.info(f"Initialized Beanie ODM with database '{self.db_name}'.")
        except Exception as e:
            logger.warning(f"MongoDB connection failed: {e}. Running in degraded local mode.")

    async def disconnect(self):
        if self.client:
            logger.info("Closing MongoDB connection...")
            self.client.close()
            logger.info("MongoDB connection closed.")

    async def ping(self) -> bool:
        if not self.client:
            return False
        try:
            await self.client.admin.command('ping')
            return True
        except Exception:
            return False

db = DatabaseManager()
