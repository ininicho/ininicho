from parsers.amex import AmexParser
from parsers.rogers import RogersParser
from parsers.wealthsimple import WealthsimpleParser
from parsers.cibc import CIBCParser
from parsers.pc_financial import PCFinancialParser

PARSERS = {
    "amex": AmexParser,
    "rogers": RogersParser,
    "wealthsimple": WealthsimpleParser,
    "cibc": CIBCParser,
    "pc": PCFinancialParser,
}


def get_parser(slug: str):
    cls = PARSERS.get(slug)
    return cls() if cls else None


def detect_slug(filename: str) -> str | None:
    """
    Detect card slug from filename.
    Convention: <slug>-YYYY-MM.pdf  e.g. amex-2025-05.pdf
    """
    name = filename.lower().split("/")[-1]
    for slug in PARSERS:
        if name.startswith(slug):
            return slug
    return None
