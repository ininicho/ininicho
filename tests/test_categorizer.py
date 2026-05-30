import sys
sys.path.insert(0, "command-center")
from categorizer import categorize

def test_grocery_store():
    assert categorize("LOBLAWS #1234") == "Groceries"

def test_coffee_shop():
    assert categorize("TIM HORTONS #456") == "Dining"

def test_rideshare():
    assert categorize("UBER TRIP") == "Transport"

def test_streaming():
    assert categorize("NETFLIX.COM") == "Entertainment"

def test_pharmacy():
    assert categorize("SHOPPERS DRUG MART") == "Health & Pharmacy"

def test_unknown_merchant():
    assert categorize("RANDOM MERCHANT XYZ") == "Other"

def test_case_insensitive():
    assert categorize("Starbucks Store 123") == "Dining"
