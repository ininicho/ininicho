import re
from parsers.base import BaseParser


class AmexParser(BaseParser):
    # Format: "Apr9 Apr11 MERCHANT CITY 17.05"
    # Two dates (MonDD — no space between month and day), merchant+city, amount.
    # Negative amounts are payments (PAYMENT RECEIVED) — skipped.
    TRANSACTION_RE = re.compile(
        r"^([A-Z][a-z]{2}\d{1,2})\s+[A-Z][a-z]{2}\d{1,2}\s+(.+?)\s+(-?[\d,]+\.\d{2})\s*$",
        re.MULTILINE,
    )

    def _extract_transactions(self, text: str) -> list[dict]:
        transactions = []
        year = self._detect_year(text)
        for match in self.TRANSACTION_RE.finditer(text):
            date_raw, merchant, amount_raw = match.groups()
            merchant = merchant.strip()
            # Skip payment and credit lines
            if "PAYMENT RECEIVED" in merchant:
                continue
            try:
                transactions.append({
                    "date": self.parse_mondd_date(date_raw, year),
                    "merchant": merchant,
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
