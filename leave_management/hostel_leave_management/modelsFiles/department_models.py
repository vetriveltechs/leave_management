# department_models.py

def insert_department():
    return """
        INSERT INTO hostel_leave_management_department (department_name, description)
        VALUES (%s, %s);
    """

def update_department():
    return """
        UPDATE hostel_leave_management_department
        SET department_name = %s, description = %s
        WHERE id = %s;
    """

def select_one_department():
    return "SELECT * FROM hostel_leave_management_department WHERE id = %s;"

def get_filtered_departments(limit=None, offset=None, department_name=None, active_flag=None, count_only=False):
    base_query = """
        SELECT {fields}
        FROM hostel_leave_management_department
        WHERE 1 = 1
    """
    where_clauses = []
    params = []

    if department_name:
        where_clauses.append("department_name LIKE %s")
        params.append(f"%{department_name}%")

    if active_flag and active_flag != 'All':
        where_clauses.append("active_flag = %s")
        params.append(active_flag)

    where_sql = ""
    if where_clauses:
        where_sql = " AND " + " AND ".join(where_clauses)

    if count_only:
        fields = "COUNT(*) as total"
        final_query = base_query.format(fields=fields) + where_sql
    else:
        fields = "id, department_name, description, active_flag"
        final_query = base_query.format(fields=fields) + where_sql
        final_query += " ORDER BY id DESC"
        if limit is not None and offset is not None:
            final_query += " LIMIT %s OFFSET %s"
            params.extend([limit, offset])

    return final_query, params


def update_department_status():
    return """
        UPDATE hostel_leave_management_department
        SET active_flag = %s,
            inactive_date = %s,
            last_updated_by = %s,
            last_updated_date = %s
        WHERE id = %s
    """

def check_department_by_name():
    return "SELECT id FROM hostel_leave_management_department WHERE department_name = %s"
