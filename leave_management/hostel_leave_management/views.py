from rest_framework import viewsets,mixins,status,parsers
from rest_framework.response import Response
from utils.utils import get_current_datetime,get_current_date_str
from .modelsFiles.common_model import *
from utils.db import execute_sql
from hostel_leave_management.modelsFiles import designation_models
from django.shortcuts import render,get_object_or_404, redirect
import sys
import os
import csv
from django.http import HttpResponse,JsonResponse,Http404
from .models import *
from .serializers import *
from django.views import View
from django.core.paginator import Paginator
from django.db.models import Count,F
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import mimetypes
from base64 import b64encode
from django.contrib import messages
from django.utils import timezone
import hashlib
from rest_framework.decorators import action,api_view
from rest_framework.parsers import MultiPartParser, FormParser
from django.views.decorators.csrf import csrf_exempt
import json
from pathlib import Path
from django.contrib.auth import authenticate, login as auth_login,logout
from django.contrib.auth.decorators import login_required

BASE_DIR = Path(__file__).resolve().parent.parent
# Create your views here.

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username=email, password=password)

        if user:
            auth_login(request, user)

            # fetch profile
            try:
                profile = user.profile
            except:
                profile = None

            # fetch roles
            lines = user.lines.filter(active_flag='Y').select_related('role')

            roles = []
            for line in lines:
                if line.role:
                    roles.append({
                        'role_id': line.role.id,
                        'role_name': line.role.role_name
                    })

            # store in session
            request.session['logged_user'] = {
                'user_id': user.id,
                'user_name': user.username,
                'roles': roles
            }

            next_url = request.GET.get('next')

            if next_url:
                return redirect(next_url)

            return redirect('dashboard')

        return render(request, 'backend/login/login.html', {'error': 'Invalid Email / Password'})

    return render(request, 'backend/login/login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required(login_url='login')
def dashboard(request):
    return render(request, 'backend/admin/dashboard.html')

def login(request):

    return render(request, 'backend/login/login.html')

@csrf_exempt
def getLineActiveStatus(request):
    """
    Endpoint: /admin/getLineActiveStatus
    Returns available active statuses for line level dropdown.
    """
    if request.method == "GET":
        print("getLineActiveStatus")
        try:
            activeFlag = lovList('ACTIVESTATUS')

            # Example fallback if DB returns empty
            if not activeFlag:
                activeFlag = [
                    {"list_value": "Y", "list_code": "Active"},
                    {"list_value": "N", "list_code": "Inactive"},
                ]

            return JsonResponse({"activeStatus": activeFlag})
        except Exception as e:
            print("Error in getLineActiveStatus:", e)  # logs in console
            return JsonResponse({"error": str(e)}, status=500)
    else:
        print("Invalid request method")
        return JsonResponse({"error": "Invalid request method"}, status=400)


class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
    
    @action(
        detail=False,
        methods=['post'],
        url_path='import',
        parser_classes=[MultiPartParser, FormParser]  # 👈 accept file upload
    )
    def import_file(self, request, *args, **kwargs):
        serializer = DesignationImportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(result, status=status.HTTP_201_CREATED)

# Regular view to show the form

@login_required(login_url='login')
def designation_form_view(request):
    queryset = Designation.objects.all()
    activeFlag = lovList('ACTIVESTATUS')
    
    context= {
        'designations': queryset,
        'activeFlag':activeFlag
    }
    return render(request, 'backend/designation/designation.html', context)



class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by('-id')
    serializer_class = DepartmentSerializer


@login_required(login_url='login')
def department_form_view(request):
    queryset = Department.objects.all()
    activeFlag = lovList('ACTIVESTATUS')
    context = {
        'departments': queryset,
        'activeFlag': activeFlag
    }
    return render(request, 'backend/department/department.html', context)

class RolesViewSet(viewsets.ModelViewSet):
    queryset = Roles.objects.all()
    serializer_class = RolesSerializer

@login_required(login_url='login')
def roles_form_view(request):
    queryset = Roles.objects.all()
    activeFlag = lovList('ACTIVESTATUS')
    context = {
        'roles': queryset,
        'activeFlag': activeFlag
    }
    return render(request, 'backend/roles/roles.html', context)


class LovViewSet(viewsets.ModelViewSet):
    queryset =  Lov.objects.all().annotate(values_count=Count('listtypevalues'))
    serializer_class = LovSerializer

@login_required(login_url='login')
def lov_view(request):
    queryset = Lov.objects.all().annotate(values_count=Count('listtypevalues'))
    activeFlag = lovList('ACTIVESTATUS')
    
    context= {
        'lov': queryset,
        'activeFlag':activeFlag
    }
    return render(request, 'backend/lov/lov.html', context)


class ListTypeValuesViewSet(viewsets.ModelViewSet):
    queryset = ListTypeValues.objects.all()
    serializer_class = ListTypeValuesSerializer

@login_required(login_url='login')
def list_type_values_list_view(request, lov_id):
    """
    HTML view for normal page load,
    JSON response if requested via AJAX.
    """
    lov = get_object_or_404(Lov, pk=lov_id)
    qs = ListTypeValues.objects.filter(list_type_id=lov_id)

    # If AJAX or JSON request -> return JSON
    if request.headers.get("x-requested-with") == "XMLHttpRequest" or \
       "application/json" in request.headers.get("Accept", ""):
        serializer = ListTypeValuesSerializer(qs, many=True)
        return JsonResponse(serializer.data, safe=False)

    # Otherwise render template for normal request
    activeFlag = lovList('ACTIVESTATUS')
    context = {
        'lov': lov,
        'list_type': qs,
        'activeFlag': activeFlag
    }
    return render(request, 'backend/lov/listTypeValues.html', context)
    
@login_required(login_url='login')
def project_list(request):
    
    # user_id = request.session.get('user_id')
    
    activeFlag = lovList('ACTIVESTATUS')
    context = {
        'activeFlag': activeFlag
    }
    return render(request, 'backend/projects/projects.html', context)

class ProjectsHeaderViewSet(viewsets.ModelViewSet):
    queryset = ProjectsHeader.objects.all()
    serializer_class = ProjectsHeaderSerializer

    @action(detail=True, methods=['patch'])
    def toggle_status(self, request, pk=None):
        project = self.get_object()
        project.active_flag = request.data.get('active_flag', project.active_flag)
        project.save()
        return Response({'status': 'success'})
@login_required(login_url='login')  
@csrf_exempt
def update_line_status(request):
    if request.method == 'POST':
        try:
            data = request.POST or json.loads(request.body)  # handle both form and JSON
            line_id = data.get('id')
            active_flag = data.get('active_flag')

            if not line_id:
                return JsonResponse({"error": "Line ID is required"}, status=400)

            line = ProjectsLine.objects.get(id=line_id)
            line.active_flag = active_flag
            line.save()
            return JsonResponse({"success": True})

        except ProjectsLine.DoesNotExist:
            return JsonResponse({"error": "Line not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Something went wrong"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@login_required(login_url='login')
def manageSetups(request):
    page_title = 'Setups'

    return render(request, 'backend/setups/setups.html', {'page_title': page_title})

class BloodGroupViewSet(viewsets.ModelViewSet):
    queryset = BloodGroup.objects.all().order_by('-id')
    serializer_class = BloodGroupSerializer

@login_required(login_url='login')
def blood_group_form_view(request):
    queryset = BloodGroup.objects.all().order_by('-id')
    activeFlag = lovList('ACTIVESTATUS')
    context = {
        'blood_groups': queryset,
        'activeFlag': activeFlag
    }
    return render(request, 'backend/blood_group/bloodGroup.html', context)


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

@login_required(login_url='login')
def country_form_view(request):
    queryset = Country.objects.all().order_by('-id')
    activeFlag = lovList('ACTIVESTATUS')
    context = {
        'countries': queryset,
        'activeFlag': activeFlag
    }
    return render(request, 'backend/country/country.html', context)


class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all().order_by('-id')
    serializer_class = StateSerializer


@login_required(login_url='login')
def state_form_view(request):
    countries = Country.objects.filter(active_flag='Y').order_by('country_name')
    activeFlag = lovList('ACTIVESTATUS')  # assuming it returns [{'list_code':'Y','list_value':'Active'}, ...]
    context = {
        'countries': countries,
        'activeFlag': activeFlag
    }
    return render(request, 'backend/state/state.html', context)

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all().order_by('-id')
    serializer_class = CitySerializer


@login_required(login_url='login')
def city_form_view(request):
    countries = Country.objects.filter(active_flag='Y').order_by('country_name')
    activeFlag = lovList('ACTIVESTATUS')
    context = {
        'countries': countries,
        'activeFlag': activeFlag
    }
    return render(request, 'backend/city/city.html', context)


@login_required(login_url='login')
def get_states_by_country(request):
    country_id = request.GET.get('country_id')
    states = State.objects.filter(country_id=country_id, active_flag='Y').values('id', 'state_name')
    return JsonResponse({'states': list(states)})

@login_required(login_url='login')
def get_cities_by_state(request):
    state_id = request.GET.get('state_id')
    cities = City.objects.filter(state_id=state_id, active_flag='Y').values('id', 'city_name')
    return JsonResponse({'cities': list(cities)})

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all().order_by('-id')
    serializer_class = LocationSerializer

@login_required(login_url='login')
def location_form_view(request):
    countries = Country.objects.filter(active_flag='Y').order_by('country_name')
    activeFlag = lovList('ACTIVESTATUS')
    context = {
        'countries': countries,
        'activeFlag': activeFlag
    }
    return render(request, 'backend/location/location.html', context)



class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employees.objects.all().order_by('-id')
    serializer_class = EmployeeSerializer
# HTML view (template page)

@login_required(login_url='login')
def employee_form_view(request):

    context = {
        'countries': Country.objects.filter(active_flag='Y').order_by('country_name'),
        'locations': Location.objects.filter(active_flag='Y'),
        'departments': Department.objects.filter(active_flag='Y'),
        'designations': Designation.objects.filter(active_flag='Y'),
        'genders': lovList('GENDER'),
        'employment_types': lovList('EMPLOYMENT-TYPE'),
        'pay_frequencies': lovList('PAY-FREQUENCIES'),
        'blood_groups': BloodGroup.objects.filter(active_flag='Y').order_by('-id'),
    }
    return render(request, 'backend/employee/employee.html', context)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer

    # Optionally you can override perform_create/perform_update if you need custom behavior

@login_required(login_url='login')
@api_view(['GET'])
def get_roles(request):
    roles = Roles.objects.filter(active_flag='Y').order_by('role_name')
    serializer = RolesSerializer(roles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@login_required(login_url='login')
@api_view(['POST'])
def update_user_line_status(request):
    line_id = request.data.get("id")
    status_flag = request.data.get("active_flag")

    if not line_id or status_flag is None:
        return Response({"error": "Missing 'id' or 'active_flag'"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        line = UserLine.objects.get(id=line_id)
        line.active_flag = status_flag
        line.save()
        return Response({"message": "Status updated"}, status=status.HTTP_200_OK)
    except UserLine.DoesNotExist:
        return Response({"error": "Line not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@login_required(login_url='login')
@api_view(['GET'])
def get_employees(request):
    employees = Employees.objects.filter(active_flag='Y').order_by('first_name').values('id', 'first_name', 'last_name')
    return Response({"employees": list(employees)}, status=status.HTTP_200_OK)


@login_required(login_url='login')
def users_form_view(request):
    # lovList function used earlier — if you have it, it should return listtypes
    try:
        userType = lovList('USER-TYPE')
        activeFlag = lovList('ACTIVESTATUS')
    except Exception:
        userType = []
        activeFlag = []
    context = {
        'userType': userType,
        'employees': Employees.objects.filter(active_flag='Y'),
        'activeFlag': activeFlag,
    }
    return render(request, 'backend/users/users.html', context)


@login_required(login_url='login')
def get_employee(request):
    employees = Employees.objects.filter(active_flag='Y').values('id', 'first_name', 'last_name')
    return JsonResponse({'employees': list(employees)})