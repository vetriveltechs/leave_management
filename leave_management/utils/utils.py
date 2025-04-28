from datetime import datetime

def get_current_datetime():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def get_current_date_str():
    return datetime.now().strftime('%d_%b_%Y')
