from datetime import datetime
from rest_framework import serializers

def get_current_datetime():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def get_current_date_str():
    return datetime.now().strftime('%d_%b_%Y')

def parse_date(value: str) -> str:
    try:
        return datetime.strptime(value, '%d-%b-%Y').date()
    except ValueError:
        raise ValueError(f"Invalid date format: {value}. Expected format is 'DD-MMM-YYYY'.")
