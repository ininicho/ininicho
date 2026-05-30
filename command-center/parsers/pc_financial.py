import re
from datetime import datetime
from parsers.base import BaseParser


class PCFinancialParser(BaseParser):
    # Format: "07/12 08/12 SHOPPERS DRUG MART #84 NORTH YORK ON $23.37"
    # Dates are dd/mm (day/month, Canadian format — NOT mm/dd).
    # "07/12" means December 7th, not July 12th. Year is inferred from statement text.
    TRANSACTION_RE = re.compile(
        r"^(\d{2}/\d{2})\s+\d{2}/\d{2}\s+(.+?)\s+\$([\d,]+\.\d{2})\s*$",
        re.MULTILINE,
    )
    SKIP_KEYWORDS = {"PAYMENT", "INTEREST", "FEE"}

    def _extract_transactions(self, text: str) -> list[dict]:
        transactions = []
        year = self._detect_year(text)
        for match in self.TRANSACTION_RE.finditer(text):
            date_raw, description, amount_raw = match.groups()
            description = description.strip()
            if any(kw in description.upper() for kw in self.SKIP_KEYWORDS):
                continue
            try:
                transactions.append({
                    "date": self._parse_pc_date(date_raw, year),
                    "merchant": description,
                    "amount": self.parse_amount(amount_raw),
                    "raw": match.group(0),
                })
            except ValueError:
                continue
        return transactions

    @staticmethod
    def _parse_pc_date(raw: str, year: int) -> str:
        """Parse 'dd/mm' (day/month) with statement year → 'YYYY-MM-DD'.

        PC Financial uses dd/mm Canadian format — do NOT use base parse_date,
        which has %m/%d/%Y (month-first) and would misread this.
        """
        dt = datetime.strptime(f"{raw}/{year}", "%d/%m/%Y")
        return dt.strftime("%Y-%m-%d")

    @staticmethod
    def _detect_year(text: str) -> int:
        match = re.search(r"\b(20\d{2})\b", text)
        return int(match.group(1)) if match else 2025
