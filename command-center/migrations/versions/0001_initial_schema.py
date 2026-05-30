"""Initial schema: cards, categories, transactions, budgets + seed data

Revision ID: 0001
Revises:
Create Date: 2026-05-30

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "cards",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("slug", sa.String(50), nullable=False),
        sa.Column("network", sa.String(20), nullable=False),
        sa.Column("closing_day", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
        sa.UniqueConstraint("slug"),
    )

    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )

    op.create_table(
        "transactions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("merchant", sa.String(255), nullable=False),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("card_id", sa.Integer(), sa.ForeignKey("cards.id")),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id")),
        sa.Column("source", sa.String(20), nullable=False, server_default="statement"),
        sa.Column("statement_file", sa.String(255)),
        sa.Column("raw_description", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("date", "merchant", "amount", "card_id"),
    )

    op.create_table(
        "budgets",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("month", sa.Date(), nullable=False),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("month"),
    )

    # Seed cards
    op.execute("""
        INSERT INTO cards (name, slug, network, closing_day) VALUES
            ('Amex Cobalt', 'amex', 'amex', 10),
            ('Wealthsimple Visa', 'wealthsimple', 'visa', 15),
            ('CIBC Visa', 'cibc', 'visa', 13),
            ('PC Financial Mastercard', 'pc', 'mastercard', 10),
            ('Rogers Mastercard', 'rogers', 'mastercard', 21)
        ON CONFLICT (slug) DO NOTHING
    """)

    # Seed categories
    op.execute("""
        INSERT INTO categories (name) VALUES
            ('Groceries'), ('Dining'), ('Transport'), ('Entertainment'),
            ('Shopping'), ('Health & Pharmacy'), ('Utilities & Telecom'),
            ('Travel'), ('Transfers'), ('Other')
        ON CONFLICT (name) DO NOTHING
    """)


def downgrade() -> None:
    op.drop_table("transactions")
    op.drop_table("budgets")
    op.drop_table("categories")
    op.drop_table("cards")
