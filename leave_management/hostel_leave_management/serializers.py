from rest_framework import serializers
from .models import *
from utils.utils import parse_date
from datetime import datetime
import base64
import uuid
from django.core.files.base import ContentFile
from drf_extra_fields.fields import Base64ImageField
from io import TextIOWrapper
import csv
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

    def validate_department_name(self, value):
        # Prevent duplicate department names (case-insensitive)
        if self.instance:
            if Department.objects.filter(department_name__iexact=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Department name already exists!")
        else:
            if Department.objects.filter(department_name__iexact=value).exists():
                raise serializers.ValidationError("Department name already exists!")
        return value

class LovSerializer(serializers.ModelSerializer):
    values_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Lov
        fields = '__all__'

    def validate_list_name(self, value):
        # Normalize: uppercase + replace spaces with hyphens
        formatted_value = value.strip().upper().replace(' ', '-')

        # Check duplicates (case-insensitive)
        qs = Lov.objects.filter(list_name__iexact=formatted_value)
        if self.instance:  # update
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError("LOV already exists!")

        return formatted_value


class ListTypeValuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListTypeValues
        fields = '__all__'

    def validate_list_code(self, value):
        formatted_value = value.strip().upper() if value else value
        list_type_id = self.initial_data.get('list_type_id')
        qs = ListTypeValues.objects.filter(
            list_type_id=list_type_id,
            list_code__iexact=formatted_value
        )
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("List Code already exists for this LOV!")
        return formatted_value

    def validate_list_value(self, value):
        return value.strip() if value else value

class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = '__all__'

    def validate_designation_name(self, value):
        # If updating → exclude current record
        if self.instance:
            if Designation.objects.filter(designation_name__iexact=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Designation already exists!")
        else:  # If creating
            if Designation.objects.filter(designation_name__iexact=value).exists():
                raise serializers.ValidationError("Designation already exists!")
        return value
    
    
class DesignationImportSerializer(serializers.Serializer):
    # 👈 match the <input name="csv"> from your form
    csv = serializers.FileField()

    def create(self, validated_data):
        file = validated_data['csv']
        reader = csv.DictReader(TextIOWrapper(file, encoding='utf-8'))

        created, updated, errors = [], [], []

        for idx, row in enumerate(reader, start=1):
            designation_name = (row.get("designation_name") or "").strip()
            description = (row.get("description") or "").strip()

            if not designation_name:
                errors.append({"row": idx, "error": "designation_name is required"})
                continue

            try:
                instance = Designation.objects.filter(
                    designation_name__iexact=designation_name
                ).first()

                if instance:
                    # update only description
                    instance.description = description
                    instance.save(update_fields=["description"])
                    updated.append(instance.designation_name)
                else:
                    new_obj = Designation.objects.create(
                        designation_name=designation_name,
                        description=description,
                    )
                    created.append(new_obj.designation_name)

            except Exception as e:
                errors.append({"row": idx, "error": str(e)})

        return {
            "created": created,
            "updated": updated,
            "errors": errors,
            "imported": len(created) + len(updated),
        }
        
        
        
        
class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'

    def validate_role_name(self, value):
        if self.instance:
            if Roles.objects.filter(role_name__iexact=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Role already exists!")
        else:
            if Roles.objects.filter(role_name__iexact=value).exists():
                raise serializers.ValidationError("Role already exists!")
        return value

        
        
class ProjectsLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectsLine
        fields = ['id', 'line_title', 'line_description', 'active_flag']


class ProjectsHeaderSerializer(serializers.ModelSerializer):
    lines = ProjectsLineSerializer(many=True, required=False)

    class Meta:
        model = ProjectsHeader
        fields = ['id', 'project_name', 'project_description', 'active_flag', 'lines']

    def create(self, validated_data):
        lines_data = validated_data.pop('lines', [])
        project = ProjectsHeader.objects.create(**validated_data)
        for line_data in lines_data:
            ProjectsLine.objects.create(header=project, **line_data)
        return project

    def update(self, instance, validated_data):
        lines_data = validated_data.pop('lines', None)  # <-- use None if not provided

        # Update header fields
        instance.project_name = validated_data.get('project_name', instance.project_name)
        instance.project_description = validated_data.get('project_description', instance.project_description)
        instance.active_flag = validated_data.get('active_flag', instance.active_flag)
        instance.save()

        # Update lines only if lines_data is provided
        if lines_data is not None:
            # Remove old lines and create new ones
            instance.lines.all().delete()
            for line_data in lines_data:
                ProjectsLine.objects.create(header=instance, **line_data)

        return instance

class BloodGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodGroup
        fields = '__all__'

    def validate_blood_group_name(self, value):
        # Prevent duplicate blood group names (case-insensitive)
        if self.instance:
            if BloodGroup.objects.filter(blood_group_name__iexact=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Blood Group name already exists!")
        else:
            if BloodGroup.objects.filter(blood_group_name__iexact=value).exists():
                raise serializers.ValidationError("Blood Group name already exists!")
        return value
    
class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

    def validate_country_name(self, value):
        if self.instance:
            if Country.objects.filter(country_name__iexact=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Country name already exists!")
        else:
            if Country.objects.filter(country_name__iexact=value).exists():
                raise serializers.ValidationError("Country name already exists!")
        return value
    
    
class StateSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.country_name', read_only=True)
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all())

    class Meta:
        model = State
        fields = '__all__'

    def validate(self, data):
        """
        Ensure both country and state_name combination is unique (case-insensitive).
        """
        country = data.get('country') or getattr(self.instance, 'country', None)
        state_name = data.get('state_name') or getattr(self.instance, 'state_name', None)

        if not country:
            raise serializers.ValidationError({"country": "Country is required."})

        if not state_name:
            raise serializers.ValidationError({"state_name": "State name is required."})

        qs = State.objects.filter(
            state_name__iexact=state_name.strip(),
            country=country
        )

        # Exclude self when updating
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError({
                "state_name": f"State '{state_name}' already exists for this country."
            })

        return data
    
    
class CitySerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.country_name', read_only=True)
    state_name = serializers.CharField(source='state.state_name', read_only=True)

    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all())
    state = serializers.PrimaryKeyRelatedField(queryset=State.objects.all())

    class Meta:
        model = City
        fields = '__all__'

    def validate(self, data):
        country = data.get('country') or getattr(self.instance, 'country', None)
        state = data.get('state') or getattr(self.instance, 'state', None)
        city_name = data.get('city_name') or getattr(self.instance, 'city_name', None)

        if not country:
            raise serializers.ValidationError({"country": "Country is required."})
        if not state:
            raise serializers.ValidationError({"state": "State is required."})
        if not city_name:
            raise serializers.ValidationError({"city_name": "City name is required."})

        qs = City.objects.filter(
            country=country,
            state=state,
            city_name__iexact=city_name.strip()
        )
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError({
                "city_name": f"City '{city_name}' already exists for this state and country."
            })
        return data
    
class LocationSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.country_name', read_only=True)
    state_name = serializers.CharField(source='state.state_name', read_only=True)
    city_name = serializers.CharField(source='city.city_name', read_only=True)

    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all())
    state = serializers.PrimaryKeyRelatedField(queryset=State.objects.all())
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())

    class Meta:
        model = Location
        fields = '__all__'

    def validate(self, data):
        location_name = data.get('location_name') or getattr(self.instance, 'location_name', None)
        country = data.get('country') or getattr(self.instance, 'country', None)
        state = data.get('state') or getattr(self.instance, 'state', None)
        city = data.get('city') or getattr(self.instance, 'city', None)

        if not location_name:
            raise serializers.ValidationError({"location_name": "Location name is required."})
        if not country:
            raise serializers.ValidationError({"country": "Country is required."})
        if not state:
            raise serializers.ValidationError({"state": "State is required."})
        if not city:
            raise serializers.ValidationError({"city": "City is required."})

        qs = Location.objects.filter(
            location_name__iexact=location_name.strip(),
            country=country,
            state=state,
            city=city
        )
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError({
                "location_name": f"Location '{location_name}' already exists for this city/state/country."
            })
        return data
    
    
class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.department_name", read_only=True)
    designation_name = serializers.CharField(source="designation.designation_name", read_only=True)
    location_name = serializers.CharField(source="location.location_name", read_only=True)
    gender_name = serializers.CharField(source="gender.list_value", read_only=True)
    blood_group_name = serializers.CharField(source="blood_group.list_value", read_only=True)
    employment_type_name = serializers.CharField(source="employment_type.list_value", read_only=True)
    
    current_country_name = serializers.CharField(source='current_country.country_name', read_only=True)
    current_state_name = serializers.CharField(source='current_state.state_name', read_only=True)
    current_city_name = serializers.CharField(source='current_city.city_name', read_only=True)

    permanent_country_name = serializers.CharField(source='permanent_country.country_name', read_only=True)
    permanent_state_name = serializers.CharField(source='permanent_state.state_name', read_only=True)
    permanent_city_name = serializers.CharField(source='permanent_city.city_name', read_only=True)


    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True, required=False
    )
    designation_id = serializers.PrimaryKeyRelatedField(
        queryset=Designation.objects.all(), source='designation', write_only=True, required=False
    )
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), source='location', write_only=True, required=False
    )
    gender_id = serializers.PrimaryKeyRelatedField(
        queryset=ListTypeValues.objects.all(), source='gender', write_only=True, required=False
    )
    employment_type_id = serializers.PrimaryKeyRelatedField(
        queryset=ListTypeValues.objects.all(), source='employment_type', write_only=True, required=False
    )
    blood_group_id = serializers.PrimaryKeyRelatedField(
        queryset=ListTypeValues.objects.all(), source='blood_group', write_only=True, required=False
    )

    class Meta:
        model = Employees
        fields = "__all__"
     

class UserLineSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.role_name', read_only=True)

    class Meta:
        model = UserLine
        fields = ['id', 'role', 'role_name', 'active_flag']

class UserProfileSerializer(serializers.ModelSerializer):
    user_type_name = serializers.CharField(source='user_type.list_value', read_only=True)
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)

    # For writes allow using ids for user_type and employee
    user_type = serializers.PrimaryKeyRelatedField(queryset=ListTypeValues.objects.all(), required=False, allow_null=True)
    employee = serializers.PrimaryKeyRelatedField(queryset=Employees.objects.filter(active_flag='Y'), required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ['user_type', 'user_type_name', 'employee', 'employee_name', 'from_date', 'to_date', 'description', 'active_flag']

class UserSerializer(serializers.ModelSerializer):
    # Nested profile (read/write)
    profile = UserProfileSerializer(required=False)
    lines = UserLineSerializer(many=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'is_active', 'profile', 'lines']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        lines_data = validated_data.pop('lines', [])

        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()

        # create profile
        UserProfile.objects.create(user=user, **profile_data)

        # create lines
        for line in lines_data:
            UserLine.objects.create(header=user, **line)

        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        lines_data = validated_data.pop('lines', None)

        # password handling
        password = validated_data.pop('password', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        if password:
            instance.set_password(password)
        instance.save()

        # update or create profile
        if profile_data is not None:
            profile, _ = UserProfile.objects.get_or_create(user=instance)
            for key, val in profile_data.items():
                setattr(profile, key, val)
            profile.save()

        # Replace lines if provided
        if lines_data is not None:
            # delete old lines and recreate — simpler approach
            instance.lines.all().delete()
            for line in lines_data:
                UserLine.objects.create(header=instance, **line)

        return instance