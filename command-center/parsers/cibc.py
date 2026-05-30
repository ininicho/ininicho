import re
from parsers.base import BaseParser


class CIBCParser(BaseParser):
    # Format: "Sep 17 Sep 18 OKONOMI HOUSE TORONTO ON Restaurants 17.70"
    # Trans date + posted date (Mon DD with space), merchant, CIBC spend category, amount.
    TRANSACTION_RE = re.compile(
        r"^([A-Z][a-z]{2}\s+\d{1,2})\s+[A-Z][a-z]{2}\s+\d{1,2}\s+(.+?)\s+([\d,]+\.\d{2})\s*$",
        re.MULTILINE,
    )
    # Known CIBC spend category suffixes embedded between merchant and amount.
    CIBC_CATEGORIES = frozenset({
        "Restaurants", "Retail and Grocery", "Entertainment",
        "Travel", "Gas and Auto", "Health and Pharmacy",
        "Utilities", "Other Charges", "Other",
    })

    def _extract_transactions(self, text: str) -> list[dict]:
        transactions = []
        year = self._detect_year(text)
        for match in self.TRANSACTION_RE.finditer(text):
            date_raw, description, amount_raw = match.groups()
            description = self._strip_category(description.strip())
            # Skip payment lines
            if "PAYMENT" in description.upper():
                continue
            try:
                transactions.append({
                    "date": self.parse_date(date_raw, year=year),
                    "merchant": description,
                    "amount": self.parse_amount(amount_raw),
                    "raw": match.group(0),
                })
            except ValueError:
                continue
        return transactions

    def _strip_category(self, description: str) -> str:
        """Remove CIBC's spend category suffix from the merchant description."""
        for cat in self.CIBC_CATEGORIES:
            if description.endswith(cat):
                return description[: -len(cat)].strip()
        return description

    @staticmethod
    def _detect_year(text: str) -> int:
        match = re.search(r"\b(20\d{2})\b", text)
        return int(match.group(1)) if match else 2025
