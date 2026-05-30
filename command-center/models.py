from sqlalchemy import (
    Column, Integer, String, Numeric, Date,
    DateTime, ForeignKey, UniqueConstraint, Text,
)
from sqlalchemy.sql import func
from database import Base


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(50), nullable=False, unique=True)
    network = Column(String(20), nullable=False)
    closing_day = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    merchant = Column(String(255), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    card_id = Column(Integer, ForeignKey("cards.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    source = Column(String(20), nullable=False, default="statement")
    statement_file = Column(String(255))
    raw_description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("date", "merchant", "amount", "card_id"),
    )


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True)
    month = Column(Date, nullable=False, unique=True)
    amount = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
