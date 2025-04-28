# common_model.py
from django.db import connection
from datetime import datetime
from utils.db import execute_sql
from utils.utils import get_current_datetime

def lov(list_name=""):
    current_datetime = get_current_datetime()

    query = """
        SELECT sm_list_type_values.list_code,
               sm_list_type_values.list_value,
               sm_list_type_values.list_type_value_id
        FROM sm_list_type_values
        LEFT JOIN sm_list_types
        ON sm_list_types.list_type_id = sm_list_type_values.list_type_id
        WHERE sm_list_types.active_flag = 'Y'
        AND COALESCE(sm_list_types.start_date, %s) <= %s
        AND COALESCE(sm_list_types.end_date, %s) >= %s
        AND sm_list_types.deleted_flag = 'N'
        AND sm_list_type_values.active_flag = 'Y'
        AND COALESCE(sm_list_type_values.start_date, %s) <= %s
        AND COALESCE(sm_list_type_values.end_date, %s) >= %s
        AND sm_list_type_values.deleted_flag = 'N'
        AND sm_list_types.list_name = %s
        ORDER BY sm_list_type_values.order_sequence ASC
    """

    result = execute_sql(query, [
        current_datetime, current_datetime,   # sm_list_types start & end
        current_datetime, current_datetime,   # again for sm_list_types
        current_datetime, current_datetime,   # sm_list_type_values start & end
        current_datetime, current_datetime,   # again for sm_list_type_values
        list_name
    ])

    return result
