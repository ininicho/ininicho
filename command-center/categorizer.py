RULES = {
    "Groceries": [
        "loblaws", "metro", "sobeys", "walmart", "costco", "food basics",
        "freshco", "no frills", "superstore", "farm boy", "whole foods",
        "longos", "fortinos", "zehrs"
    ],
    "Dining": [
        "tim hortons", "starbucks", "mcdonalds", "mcdonald", "subway",
        "harveys", "burger king", "pizza", "restaurant", "cafe", "coffee",
        "sushi", "thai", "chinese", "indian", "kfc", "popeyes", "wendy",
        "chipotle", "five guys", "shawarma", "pho", "ramen", "diner"
    ],
    "Transport": [
        "uber", "lyft", "ttc", "presto", "esso", "petro-canada", "petro canada",
        "shell", "husky", "sunoco", "parking", "impark", "green p",
        "via rail", "go transit", "taxi"
    ],
    "Entertainment": [
        "netflix", "spotify", "apple.com/bill", "amazon prime",
        "disney", "youtube", "crave", "prime video", "hbo", "paramount",
        "cineplex", "ticketmaster", "steam", "playstation", "xbox"
    ],
    "Shopping": [
        "amazon", "best buy", "bestbuy", "ikea", "h&m", "zara", "gap",
        "old navy", "roots", "winners", "homesense", "the bay", "hudson",
        "indigo", "chapters", "sport chek", "canadian tire"
    ],
    "Health & Pharmacy": [
        "shoppers drug mart", "shoppers", "rexall", "pharmacy",
        "medical", "dental", "vision", "physio", "lcbo", "beer store",
        "la vie en rose", "la senza"
    ],
    "Utilities & Telecom": [
        "rogers", "bell", "telus", "fido", "koodo", "public mobile",
        "hydro", "enbridge", "union gas", "toronto hydro", "hydro one",
        "internet", "wireless"
    ],
    "Travel": [
        "airbnb", "expedia", "booking.com", "hotels.com", "air canada",
        "westjet", "porter", "kayak", "trivago", "marriott", "hilton",
        "hyatt", "airport"
    ],
    "Transfers": [
        "e-transfer", "etransfer", "interac", "wire transfer", "transfer to",
        "transfer from", "wealthsimple", "paypal"
    ],
}


def categorize(merchant: str) -> str:
    """Return category name for a merchant string."""
    merchant_lower = merchant.lower()
    for category, keywords in RULES.items():
        if any(kw in merchant_lower for kw in keywords):
            return category
    return "Other"
