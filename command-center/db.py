from contextlib import contextmanager
from sqlalchemy import func, extract
from sqlalchemy.dialects.postgresql import insert as pg_insert

from database import SessionLocal
from models import Card, Category, Transaction, Budget


@contextmanager
def get_session():
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_card_id(slug: str) -> int | None:
    with get_session() as s:
        card = s.query(Card).filter_by(slug=slug).first()
        return card.id if card else None


def get_category_id(name: str) -> int | None:
    with get_session() as s:
        cat = s.query(Category).filter_by(name=name).first()
        return cat.id if cat else None


def insert_transaction(date, merchant, amount, card_id, category_id,
                       source="statement", statement_file=None, raw_description=None) -> bool:
    """Insert a transaction. Returns True if inserted, False if duplicate (skipped)."""
    with get_session() as s:
        stmt = (
            pg_insert(Transaction)
            .values(
                date=date, merchant=merchant, amount=amount,
                card_id=card_id, category_id=category_id,
                source=source, statement_file=statement_file,
                raw_description=raw_description,
            )
            .on_conflict_do_nothing()
        )
        result = s.execute(stmt)
        # rowcount == 1 means inserted; 0 means duplicate was skipped.
        # Avoid inserted_primary_key — unreliable with on_conflict_do_nothing.
        return result.rowcount > 0


def get_monthly_totals(month: str) -> list[dict]:
    """month: 'YYYY-MM'"""
    year, mo = month.split("-")
    with get_session() as s:
        rows = (
            s.query(Category.name, func.sum(Transaction.amount).label("total"))
            .join(Transaction, Transaction.category_id == Category.id)
            .filter(
                extract("year", Transaction.date) == int(year),
                extract("month", Transaction.date) == int(mo),
            )
            .group_by(Category.name)
            .order_by(func.sum(Transaction.amount).desc())
            .all()
        )
        return [{"category": r.name, "total": float(r.total)} for r in rows]


def get_monthly_total(month: str) -> float:
    year, mo = month.split("-")
    with get_session() as s:
        total = (
            s.query(func.coalesce(func.sum(Transaction.amount), 0))
            .filter(
                extract("year", Transaction.date) == int(year),
                extract("month", Transaction.date) == int(mo),
            )
            .scalar()
        )
        return float(total)


def get_budget(month: str) -> float | None:
    """month: 'YYYY-MM'"""
    year, mo = month.split("-")
    with get_session() as s:
        budget = (
            s.query(Budget)
            .filter(
                extract("year", Budget.month) == int(year),
                extract("month", Budget.month) == int(mo),
            )
            .first()
        )
        return float(budget.amount) if budget else None
