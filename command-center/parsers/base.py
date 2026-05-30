import re
from abc import ABC, abstractmethod
from datetime import datetime


class BaseParser(ABC):
    """
    Subclasses implement _extract_transactions(text) and return a list of dicts:
    [{"date": date, "merchant": str, "amount": Decimal, "raw": str}]

    Filename convention: <slug>-YYYY-MM.pdf  e.g. amex-2025-05.pdf
    """

    @abstractmethod
    def _extract_transactions(self, text: str) -> list[dict]:
        raise NotImplementedError

    def parse(self, pdf_path: str) -> list[dict]:
        import pdfplumber
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n".join(
                page.extract_text() or "" for page in pdf.pages
            )
        return self._extract_transactions(text)

    @staticmethod
    def parse_amount(raw: str) -> float:
        """Convert amount strings to float.

        Handles: '$1,234.56', '1,234.56', '-123.45', '–$1,384.43'
        En-dash (–) and minus sign (−) are both normalised to hyphen-minus.
        """
        # Normalise Unicode dashes to regular hyphen-minus
        cleaned = raw.replace("–", "-").replace("−", "-")
        cleaned = re.sub(r"[,$\s]", "", cleaned)
        return float(cleaned)

    @staticmethod
    def parse_mondd_date(raw: str, year: int) -> str:
        """Parse 'Apr9' or 'Apr24' (no space between month and day) → 'YYYY-MM-DD'.

        Used by Amex and Rogers statements which both use MonDD format.
        """
        dt = datetime.strptime(f"{raw} {year}", "%b%d %Y")
        return dt.strftime("%Y-%m-%d")

    @staticmethod
    def parse_date(raw: str, year: int | None = None) -> str:
        """Parse common date formats → 'YYYY-MM-DD'.

        Handles:
          'Jan 15, 2025'  → %b %d, %Y
          'Jan 15 2025'   → %b %d %Y
          '2025-01-15'    → %Y-%m-%d
          '01/15/2025'    → %m/%d/%Y
          '15/01/2025'    → %d/%m/%Y
          'Jan 15' + year → %b %d %Y

        Note: Amex/Rogers use 'Apr9' (no space) — handled by BaseParser.parse_mondd_date.
        """
        formats = ["%b %d, %Y", "%b %d %Y", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y"]
        for fmt in formats:
            try:
                return datetime.strptime(raw.strip(), fmt).strftime("%Y-%m-%d")
            except ValueError:
                continue
        if year:
            for fmt in ["%b %d", "%b. %d"]:
                try:
                    return datetime.strptime(f"{raw.strip()} {year}", f"{fmt} %Y").strftime("%Y-%m-%d")
                except ValueError:
                    continue
        raise ValueError(f"Cannot parse date: {raw!r}")
