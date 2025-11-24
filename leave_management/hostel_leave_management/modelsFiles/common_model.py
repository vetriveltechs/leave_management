# common_model.py
from django.db import connection
from datetime import datetime
from utils.db import execute_sql
from utils.utils import get_current_datetime
from django.db import models
from django.utils.timezone import now
from hostel_leave_management.models import Lov, ListTypeValues

def lovList(list_name=""):
    current_datetime = now()

    result = list(
        ListTypeValues.objects.filter(
            list_type_id__list_name=list_name,
            list_type_id__active_flag="Y",
            list_type_id__deleted_flag="N",
            active_flag="Y",
            deleted_flag="N",
        )
        .filter(
            models.Q(start_date__lte=current_datetime) | models.Q(start_date__isnull=True),
            models.Q(end_date__gte=current_datetime) | models.Q(end_date__isnull=True),
        )
        .values("list_code", "list_value", "list_type_value_id")
        .order_by("order_sequence")
    )

    return result
