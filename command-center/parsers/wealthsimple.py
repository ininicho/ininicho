import re
from parsers.base import BaseParser


class WealthsimpleParser(BaseParser):
    # Format: "Apr 15 Apr 16 Purchase PUFF 9 VAPE $59.88"
    # Trans date + posted date (Mon DD), TYPE column, merchant, amount with $ prefix.
    # Matching only Purchase lines — Payment lines (TYPE = Payment) are skipped automatically.
    TRANSACTION_RE = re.compile(
        r"^([A-Z][a-z]{2}\s+\d{1,2})\s+[A-Z][a-z]{2}\s+\d{1,2}\s+Purchase\s+(.+?)\s+\$([\d,]+\.\d{2})\s*$",
        re.MULTILINE,
    )

    def _extract_transactions(self, text: str) -> list[dict]:
        transactions = []
        year = self._detect_year(text)
        for match in self.TRANSACTION_RE.finditer(text):
            date_raw, merchant, amount_raw = match.groups()
            try:
                transactions.append({
                    "date": self.parse_date(date_raw, year=year),
                    "merchant": merchant.strip(),
                    "amount": self.parse_amount(amount_raw),
                    "raw": match.group(0),
                })
            except ValueError:
                continue
        return transactions

    @staticmethod
    def _detect_year(text: str) -> int:
        match = re.search(r"\b(20\d{2})\b", text)
        return int(match.group(1)) if match else 2025
