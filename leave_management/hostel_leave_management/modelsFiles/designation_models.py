# designation_models.py

def insert_designation():
    return """
        INSERT INTO hostel_leave_management_designation (designation_name, description)
        VALUES (%s, %s);
    """

def update_designation():
    return """
        UPDATE hostel_leave_management_designation
        SET designation_name = %s, description = %s
        WHERE id = %s;
    """

def select_one_designation():
    return "SELECT * FROM hostel_leave_management_designation WHERE id = %s;"

def get_filtered_designations(limit=None, offset=None, designation_name=None, active_flag=None, count_only=False):
    base_query = """
        SELECT {fields}
        FROM hostel_leave_management_designation
        WHERE 1 = 1
    """
    where_clauses = []
    params = []

    if designation_name:
        where_clauses.append("designation_name LIKE %s")
        params.append(f"%{designation_name}%")

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
        fields = "id, designation_name, description, active_flag"
        final_query = base_query.format(fields=fields) + where_sql
        final_query += " ORDER BY id DESC"
        if limit is not None and offset is not None:
            final_query += " LIMIT %s OFFSET %s"
            params.extend([limit, offset])

    return final_query, params


def update_designation_status():
    return """
        UPDATE hostel_leave_management_designation
        SET active_flag = %s,
            inactive_date = %s,
            last_updated_by = %s,
            last_updated_date = %s
        WHERE id = %s
    """

def check_designation_by_name():
    return "SELECT id FROM hostel_leave_management_designation WHERE designation_name = %s"
