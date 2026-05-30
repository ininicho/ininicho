import sys
from decimal import Decimal
sys.path.insert(0, "command-center")
from parsers.base import BaseParser
from parsers import get_parser


class ConcreteParser(BaseParser):
    def _extract_transactions(self, text):
        return []


def test_parse_amount_with_dollar_sign():
    p = ConcreteParser()
    assert p.parse_amount("$1,234.56") == 1234.56


def test_parse_amount_negative():
    p = ConcreteParser()
    assert p.parse_amount("-123.45") == -123.45


def test_parse_date_full():
    p = ConcreteParser()
    assert p.parse_date("Jan 15, 2025") == "2025-01-15"


def test_parse_date_short_with_year():
    p = ConcreteParser()
    assert p.parse_date("Jan 15", year=2025) == "2025-01-15"


def test_parse_date_iso():
    p = ConcreteParser()
    assert p.parse_date("2025-01-15") == "2025-01-15"


def test_get_parser_amex():
    parser = get_parser("amex")
    assert parser is not None


def test_get_parser_rogers():
    assert get_parser("rogers") is not None


def test_get_parser_unknown():
    assert get_parser("unknown") is None


def test_parse_mondd_date():
    p = ConcreteParser()
    assert p.parse_mondd_date("Apr9", 2026) == "2026-04-09"
    assert p.parse_mondd_date("Apr24", 2026) == "2026-04-24"
    assert p.parse_mondd_date("May1", 2026) == "2026-05-01"


def test_parse_amount_en_dash():
    p = ConcreteParser()
    # Wealthsimple uses en-dash (–) for negative amounts
    assert p.parse_amount("–$1,384.43") == -1384.43
