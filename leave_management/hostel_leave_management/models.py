from django.db import models

class Department(models.Model):
    # department_id = models.AutoField(primary_key=True)  # Custom primary key
    department_name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    active_flag = models.CharField(max_length=1, default='Y')
    inactive_date = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField(null=True, blank=True)
    created_date = models.DateTimeField(null=True, blank=True)
    last_updated_by = models.IntegerField(null=True, blank=True)
    last_updated_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.department_name

class Designation(models.Model):
    # department_id = models.AutoField(primary_key=True)  # Custom primary key
    designation_name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    active_flag = models.CharField(max_length=1, default='Y')
    inactive_date = models.DateTimeField(null=True, blank=True)
    created_by = models.IntegerField(null=True, blank=True)
    created_date = models.DateTimeField(null=True, blank=True)
    last_updated_by = models.IntegerField(null=True, blank=True)
    last_updated_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.department_name
