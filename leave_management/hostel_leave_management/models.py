from django.db import models

from django.utils import timezone

import os

from django.contrib.auth.models import User

from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

from django.conf import settings

class Department(models.Model):
    department_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    active_flag = models.CharField(max_length=1, default='Y')
    created_by = models.CharField(max_length=50, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated_by = models.CharField(max_length=50, blank=True, null=True)
    last_updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.department_name

    class Meta:
        db_table = 'departments'
        ordering = ['-id']
        
        
class Designation(models.Model):
    designation_id      = models.AutoField(primary_key=True)  # Custom primary key
    designation_name    = models.CharField(max_length=255, null=True, blank=True)
    description         = models.TextField(null=True, blank=True)
    active_flag         = models.CharField(max_length=1, default='Y')
    inactive_date       = models.DateTimeField(null=True, blank=True)
    created_by          = models.IntegerField(null=True, blank=True)
    created_date        = models.DateTimeField(auto_now_add=True)  # Set when record is first created
    last_updated_by     = models.IntegerField(null=True, blank=True)
    last_updated_date   = models.DateTimeField(auto_now=True)      # Updated on every save

    def __str__(self):
        return self.designation_name
    class Meta:
        db_table = 'designations'

class Lov(models.Model):
    # department_id = models.AutoField(primary_key=True)  # Custom primary key
    list_type_id      = models.AutoField(primary_key=True)
    list_name         = models.CharField(max_length=255, null=True, blank=True)
    description       = models.TextField(null=True, blank=True)
    active_flag       = models.CharField(max_length=1, default='Y')
    inactive_date     = models.DateTimeField(null=True, blank=True)
    created_by        = models.IntegerField(null=True, blank=True)
    created_date      = models.DateTimeField(null=True, blank=True)
    last_updated_by   = models.IntegerField(null=True, blank=True)
    last_updated_date = models.DateTimeField(null=True, blank=True)
    deleted_flag         = models.CharField(max_length=1, default='N')

    def __str__(self):
        return self.list_name or "Unnamed"
    class Meta:
        db_table = 'lov'

class ListTypeValues(models.Model):
    list_type_value_id  = models.AutoField(primary_key=True)
    list_type_id        = models.ForeignKey(Lov, on_delete=models.CASCADE, db_column='list_type_id', null=True, blank=True)
    list_code           = models.CharField(max_length=150, null=True, blank=True)
    list_value          = models.CharField(max_length=150, null=True, blank=True)
    order_sequence      = models.IntegerField(null=True, blank=True)
    short_description   = models.CharField(max_length=255,null=True, blank=True)
    active_flag         = models.CharField(max_length=1, default='Y')
    inactive_date       = models.DateField(null=True, blank=True)
    start_date          = models.DateField(null=True, blank=True)
    end_date            = models.DateField(null=True, blank=True)
    created_by          = models.IntegerField(null=True, blank=True)
    created_date        = models.DateTimeField(null=True, blank=True)
    last_updated_by     = models.IntegerField(null=True, blank=True)
    last_updated_date   = models.DateTimeField(null=True, blank=True)
    deleted_flag         = models.CharField(max_length=1, default='N')

    def __str__(self):
        return self.list_code or "Unnamed Code"
    class Meta:
        db_table = 'list_type_values'
        
        
class Roles(models.Model):
    role_name           = models.CharField(max_length=100)
    description         = models.TextField(blank=True, null=True)
    active_flag         = models.CharField(max_length=1, default='Y')
    created_by          = models.CharField(max_length=100, blank=True, null=True)
    created_date        = models.DateTimeField(auto_now_add=True)
    last_updated_by     = models.CharField(max_length=100, blank=True, null=True)
    last_updated_date   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'roles'

    def __str__(self):
        return self.role_name


        
class ProjectsHeader(models.Model):
    project_name = models.CharField(max_length=255)
    project_description = models.TextField(blank=True, null=True)
    active_flag = models.CharField(max_length=1, default='Y')
    created_by = models.CharField(max_length=100, blank=True, null=True)
    created_date = models.DateTimeField(default=timezone.now)
    last_updated_by = models.CharField(max_length=100, blank=True, null=True)
    last_updated_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.project_name

    class Meta:
        db_table = 'projects_header'


class ProjectsLine(models.Model):
    header = models.ForeignKey(ProjectsHeader, related_name='lines', on_delete=models.CASCADE)
    line_title = models.CharField(max_length=255)
    line_description = models.TextField(blank=True, null=True)
    active_flag = models.CharField(max_length=1, default='Y')
    created_by = models.CharField(max_length=100, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated_by = models.CharField(max_length=100, blank=True, null=True)
    last_updated_date = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'projects_line'
        
        
class BloodGroup(models.Model):
    blood_group_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    active_flag = models.CharField(max_length=1, default='Y')  # Y/N
    created_by = models.CharField(max_length=50, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated_by = models.CharField(max_length=50, blank=True, null=True)
    last_updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.blood_group_name
    
    class Meta:
        db_table    = 'blood_groups'
        ordering    = ['-id']
        
def country_flag_upload_path(instance, filename):
    """
    Initial uploads go to MEDIA_ROOT/temp.<ext>
    """
    ext = filename.split('.')[-1]
    return f"temp.{ext}"

class Country(models.Model):
    country_name = models.CharField(max_length=100)
    country_code = models.CharField(max_length=10)
    currency_symbol = models.CharField(max_length=10)
    currency_code = models.CharField(max_length=10)
    country_flag = models.ImageField(upload_to=country_flag_upload_path, null=True, blank=True)
    active_flag = models.CharField(max_length=1, default='Y')  # Y/N
    created_by = models.CharField(max_length=50, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated_by = models.CharField(max_length=50, blank=True, null=True)
    last_updated_date = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        
        is_new = self.pk is None
        old_file = None

        if not is_new:
            try:
                old_obj = Country.objects.get(pk=self.pk)
                old_file = old_obj.country_flag.path if old_obj.country_flag else None
            except Country.DoesNotExist:
                old_file = None

        # Save first to get PK
        super().save(*args, **kwargs)

        if self.country_flag:
            old_path = self.country_flag.path
            ext = os.path.splitext(old_path)[1]

            # Final directory: uploads/country/
            new_dir = os.path.join(settings.MEDIA_ROOT, 'country')
            os.makedirs(new_dir, exist_ok=True)

            # Final path: uploads/country/<pk>.ext
            new_path = os.path.join(new_dir, f"{self.pk}{ext}")

            # Only move if temp file
            if 'temp.' in os.path.basename(old_path):
                # Delete existing country image if editing
                if old_file and os.path.exists(old_file):
                    os.remove(old_file)

                # Remove new_path if it exists (Windows safety)
                if os.path.exists(new_path):
                    os.remove(new_path)

                # Move temp to final folder
                os.rename(old_path, new_path)

                # Store relative path inside 'uploads/' folder
                self.country_flag.name = os.path.join('country', f"{self.pk}{ext}").replace("\\", "/")
                super().save(update_fields=['country_flag'])

    def __str__(self):
        return self.country_name

    class Meta:
        db_table = 'countries'
        ordering = ['-id']
        
        
class State(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    state_name = models.CharField(max_length=100, unique=True)
    state_code = models.CharField(max_length=10, blank=True, null=True)
    state_number = models.CharField(max_length=20, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    active_flag = models.CharField(max_length=1, default='Y')
    created_by = models.CharField(max_length=50, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated_by = models.CharField(max_length=50, blank=True, null=True)
    last_updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.state_name} ({self.country.country_name})"

    class Meta:
        db_table = 'states'
        ordering = ['-id']
        
        
class City(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    city_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    active_flag = models.CharField(max_length=1, default='Y')
    created_by = models.CharField(max_length=50, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated_by = models.CharField(max_length=50, blank=True, null=True)
    last_updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.city_name} - {self.state.state_name}, {self.country.country_name}"

    class Meta:
        db_table = 'cities'
        ordering = ['-id']
        
class Location(models.Model):
    location_name = models.CharField(max_length=200)
    country = models.ForeignKey('Country', on_delete=models.CASCADE)
    state = models.ForeignKey('State', on_delete=models.CASCADE)
    city = models.ForeignKey('City', on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    active_flag = models.CharField(max_length=1, default='Y')
    created_by = models.CharField(max_length=50, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated_by = models.CharField(max_length=50, blank=True, null=True)
    last_updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.location_name} ({self.city.city_name}, {self.state.state_name}, {self.country.country_name})"

    class Meta:
        db_table = 'locations'
        ordering = ['-id']
        
        
        
class Employees(models.Model):
    # Basic Info
    employment_type = models.ForeignKey(ListTypeValues, on_delete=models.SET_NULL, null=True, blank=True, related_name="emp_type")
    first_name = models.CharField(max_length=100, blank=True, null=True)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    mobile_number = models.CharField(max_length=20, blank=True, null=True)
    alt_mobile_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    alt_email = models.EmailField(blank=True, null=True)
    father_name = models.CharField(max_length=100, blank=True, null=True)
    mother_name = models.CharField(max_length=100, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.ForeignKey(ListTypeValues, on_delete=models.SET_NULL, null=True, blank=True, related_name="gender_type")
    blood_group = models.ForeignKey(ListTypeValues, on_delete=models.SET_NULL, null=True, blank=True, related_name="blood_group_type")
    profile_image = models.ImageField(upload_to='uploads/employee/profile/', blank=True, null=True)

    # Employee Details
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="emp_department")
    designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, null=True, blank=True, related_name="emp_designation")
    date_of_joining = models.DateField(blank=True, null=True)
    date_of_releaving = models.DateField(blank=True, null=True)
    previous_experience = models.IntegerField(blank=True, null=True)
    rate_per_hour = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    rate_per_day = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    pay_frequency = models.ForeignKey(ListTypeValues, on_delete=models.SET_NULL, null=True, blank=True, related_name="pay_frequency_type")

    # Identity
    aadhar_no = models.CharField(max_length=30, blank=True, null=True)
    pan_number = models.CharField(max_length=30, blank=True, null=True)
    driving_licence = models.CharField(max_length=50, blank=True, null=True)
    passport_no = models.CharField(max_length=30, blank=True, null=True)
    passport_issue_date = models.DateField(blank=True, null=True)
    passport_expiry_date = models.DateField(blank=True, null=True)
    pf_no = models.CharField(max_length=50, blank=True, null=True)
    esi_no = models.CharField(max_length=50, blank=True, null=True)
    uan_no = models.CharField(max_length=50, blank=True, null=True)

    # Current Address
    current_address1 = models.CharField(max_length=255, blank=True, null=True)
    current_address2 = models.CharField(max_length=255, blank=True, null=True)
    current_address3 = models.CharField(max_length=255, blank=True, null=True)
    current_country = models.ForeignKey(Country, on_delete=models.SET_NULL, blank=True, null=True, related_name='emp_current_country')
    current_state = models.ForeignKey(State, on_delete=models.SET_NULL, blank=True, null=True, related_name='emp_current_state')
    current_city = models.ForeignKey(City, on_delete=models.SET_NULL, blank=True, null=True, related_name='emp_current_city')
    current_postal_code = models.CharField(max_length=20, blank=True, null=True)

    # Permanent Address
    permanent_address1 = models.CharField(max_length=255, blank=True, null=True)
    permanent_address2 = models.CharField(max_length=255, blank=True, null=True)
    permanent_address3 = models.CharField(max_length=255, blank=True, null=True)
    permanent_country = models.ForeignKey(Country, on_delete=models.SET_NULL, blank=True, null=True, related_name='emp_perm_country')
    permanent_state = models.ForeignKey(State, on_delete=models.SET_NULL, blank=True, null=True, related_name='emp_perm_state')
    permanent_city = models.ForeignKey(City, on_delete=models.SET_NULL, blank=True, null=True, related_name='emp_perm_city')
    permanent_postal_code = models.CharField(max_length=20, blank=True, null=True)

    # Bank Details
    account_number = models.CharField(max_length=50, blank=True, null=True)
    account_holder_name = models.CharField(max_length=150, blank=True, null=True)
    bank_name = models.CharField(max_length=150, blank=True, null=True)
    bank_branch = models.CharField(max_length=150, blank=True, null=True)
    ifsc_code = models.CharField(max_length=15, blank=True, null=True)
    micr_code = models.CharField(max_length=15, blank=True, null=True)
    bank_address = models.TextField(blank=True, null=True)

    active_flag = models.CharField(max_length=1, default='Y')
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'employees'
        ordering = ['-id']

    def __str__(self):
        return f"{self.first_name or ''} {self.last_name or ''}".strip()
    
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    # store user_type as FK if you have ListTypeValues; else int is fine
    user_type = models.ForeignKey(ListTypeValues, on_delete=models.SET_NULL, null=True, blank=True)
    employee = models.ForeignKey(Employees, on_delete=models.SET_NULL, null=True, blank=True)
    from_date = models.DateField(null=True, blank=True)
    to_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    active_flag = models.CharField(max_length=1, default='Y')

    def __str__(self):
        return f"profile: {self.user.username}"
    
    class Meta:
        db_table = 'user_profiles'
        ordering = ['-id']

# lines (user roles)
class UserLine(models.Model):
    header = models.ForeignKey(User, related_name='lines', on_delete=models.CASCADE)
    role = models.ForeignKey(Roles, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_lines')
    active_flag = models.CharField(max_length=1, default='Y')
    created_date = models.DateTimeField(auto_now_add=True)
    last_updated_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.header.username} - {self.role.role_name if self.role else ''}"
    
    class Meta:
        db_table = 'user_lines'
        ordering = ['-id']