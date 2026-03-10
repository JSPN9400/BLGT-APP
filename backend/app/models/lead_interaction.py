import enum

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class InteractionChannel(str, enum.Enum):
    CALL = "Call"
    WHATSAPP = "WhatsApp"
    EMAIL = "Email"
    SMS = "SMS"
    MEETING = "Meeting"
    OTHER = "Other"


class InteractionDirection(str, enum.Enum):
    OUTBOUND = "Outbound"
    INBOUND = "Inbound"


class InteractionOutcome(str, enum.Enum):
    NO_RESPONSE = "No Response"
    INTERESTED = "Interested"
    FOLLOW_UP = "Follow Up"
    NEGOTIATING = "Negotiating"
    CONVERTED = "Converted"
    LOST = "Lost"


class LeadInteraction(Base):
    __tablename__ = "lead_interactions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id", ondelete="CASCADE"), nullable=False, index=True)
    channel: Mapped[InteractionChannel] = mapped_column(Enum(InteractionChannel), nullable=False)
    direction: Mapped[InteractionDirection] = mapped_column(Enum(InteractionDirection), default=InteractionDirection.OUTBOUND, nullable=False)
    outcome: Mapped[InteractionOutcome] = mapped_column(Enum(InteractionOutcome), nullable=False)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    client_response: Mapped[str | None] = mapped_column(Text, nullable=True)
    contacted_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    lead = relationship("Lead", back_populates="interactions")
