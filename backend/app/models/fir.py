from sqlalchemy import Column, String, DateTime, JSON, Enum, Integer
from sqlalchemy.ext.declarative import declarative_base
import enum, uuid
from datetime import datetime

Base = declarative_base()

class FIRStatus(str, enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    REVIEWED = "reviewed"

class FIR(Base):
    __tablename__ = "firs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, nullable=False)
    complainant_name = Column(String)
    complainant_contact = Column(String)
    incident_date = Column(String)
    incident_location = Column(String)
    incident_description = Column(String)
    accused_description = Column(String)
    witnesses = Column(String)
    recommended_sections = Column(JSON)   
    raw_conversation = Column(JSON)       
    language = Column(String, default="en")
    status = Column(Enum(FIRStatus), default=FIRStatus.DRAFT)
    station_code = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)