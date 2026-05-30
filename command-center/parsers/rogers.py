import re
from parsers.base import BaseParser


class RogersParser(BaseParser):
    # Format: "Apr24 Apr27 PAYMENT,THANKYOU -776.16"
    #         "Apr30 May1  ROGERS******4310 TORONTO ON 28.25"
    # Dates: MonDD (no space between month and day), same format as Amex.
    # Skipped: negative amounts (payments), CASHADVANCEFEE, CASHINTEREST.
    TRANSACTION_RE = re.compile(
        r"^([A-Z][a-z]{2}\d{1,2})\s+[A-Z][a-z]{2}\d{1,2}\s+(.+?)\s+(-?[\d,]+\.\d{2})\s*$",
        re.MULTILINE,
    )
    SKIP_KEYWORDS = {"PAYMENT", "CASHADVANCEFEE", "CASHINTEREST"}

    def _extract_transactions(self, text: str) -> list[dict]:
        transactions = []
        year = self._detect_year(text)
        for match in self.TRANSACTION_RE.finditer(text):
            date_raw, description, amount_raw = match.groups()
            description = description.strip()
            amount = self.parse_amount(amount_raw)
            # Skip payments (negative amounts)
            if amount < 0:
                continue
            # Skip fee and interest lines
            if any(kw in description.upper() for kw in self.SKIP_KEYWORDS):
                continue
            try:
                transactions.append({
                    "date": self.parse_mondd_date(date_raw, year),
                    "merchant": description,
                    "amount": amount,
                    "raw": match.group(0),
                })
            except ValueError:
                continue
        return transactions

    @staticmethod
    def _detect_year(text: str) -> int:
        match = re.search(r"\b(20\d{2})\b", text)
        return int(match.group(1)) if match else 2025
