from django.db import connection

def execute_sql(query, params=None):
    with connection.cursor() as cursor:
        cursor.execute(query, params or [])

        # If it's a SELECT query, fetch and return results
        if cursor.description:
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]

        # For INSERT/UPDATE/DELETE, just return empty list
        return []
