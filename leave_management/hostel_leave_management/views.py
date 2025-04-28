from rest_framework import viewsets
from rest_framework.response import Response
from hostel_leave_management.modelsFiles import department_models
from utils.utils import get_current_datetime,get_current_date_str
from .modelsFiles.common_model import lov
from utils.db import execute_sql
from hostel_leave_management.modelsFiles import designation_models
from django.shortcuts import render,get_object_or_404, redirect
import sys
import os
import csv
from django.http import HttpResponse
from .modelsFiles.department_models import *
from .modelsFiles.designation_models import *
from .models import *
from .serializers import DepartmentSerializer
from django.views import View
from django.core.paginator import Paginator
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# Create your views here.

def dashboard(request):
    return render(request, 'backend/admin/dashboard.html')


# def manage_departments(request, action=None, id=None):
#     page_title = 'Departments'
#     if action == 'add':

#         if request.method == 'POST':

#             department = Department(
#                 department_name = request.POST.get('department_name'),
#                 description     = request.POST.get('description')
#             )
#             department.save()

#             return redirect('list_departments')

#         return render(request, 'backend/department/department.html', {'action': 'add'})

#     elif (action == 'edit' or action == 'view') and id:
#         if request.method == 'POST':

#             Department.objects.filter(id=id).update(
#                 department_name   = request.POST.get('department_name'),
#                 description       = request.POST.get('description')
#             )

#             return redirect('list_departments')

#         department = Department.objects.get(id=id)

#         return render(request, 'backend/department/department.html', {'action': action, 'data': department})


#     elif action == 'status' and id:
#         status = request.GET.get('status')  # 'Y' or 'N'
#         date_time = get_current_datetime()

#         Department.objects.update_or_create(
#             id=id,
#             defaults={
#                 'active_flag': status,  # Corrected the typo here
#             }
#         )
#         return redirect(request.META.get('HTTP_REFERER', 'list_departments'))

#     elif action == 'import':

#         if request.method == 'POST':

#             if request.method == 'POST' and request.FILES.get("csv"):
#                 csv_file = request.FILES["csv"]

#                 if csv_file.size > 0:
#                     decoded_file = csv_file.read().decode("utf-8").splitlines()
#                     reader = csv.reader(decoded_file)
#                     next(reader)  # Skip header row

#                     for row in reader:
#                         department_name = row[0].strip() if len(row) > 0 else None
#                         description = row[1].strip() if len(row) > 1 else None

#                         Department.objects.update_or_create(
#                             department_name=department_name,
#                             defaults={'description': description}
#                         )

#                 return redirect("list_departments")

#             return redirect('list_departments')

#         return redirect('list_departments')

#     else:
#         list_name = 'ACTIVESTATUS'
#         activeFlag = lov(list_name)  # Assuming this fetches some options

#         department_name = request.GET.get('department_name', '')
#         active_flag = request.GET.get('active_flag', '')
#         export = request.GET.get('export', '')
#         page = int(request.GET.get('page', 1))
#         limit = int(request.GET.get('limit', 10))
#         offset = (page - 1) * limit

#         # Using Django ORM for counting rows
#         filter_conditions = {}
#         if department_name:
#             filter_conditions['department_name__icontains'] = department_name
#         if active_flag:
#             filter_conditions['active_flag'] = active_flag

#         total_rows = Department.objects.filter(**filter_conditions).count()

#         # Using Django ORM for fetching data
#         departments = Department.objects.filter(**filter_conditions) \
#             .values('id','department_name', 'description', 'active_flag') \
#             .order_by('department_name') \
#             .all()[offset:offset + limit]

#         if export:
#             # Prepare CSV export
#             date_str = get_current_date_str()
#             response = HttpResponse(content_type='text/csv')
#             response['Content-Disposition'] = f'attachment; filename="Departments_{date_str}.csv"'
#             response['Pragma'] = 'no-cache'
#             response['Expires'] = '0'

#             writer = csv.writer(response)
#             writer.writerow(['S.No', 'Department Name', 'Description', 'Active Status'])

#             for idx, row in enumerate(departments, start=1):
#                 writer.writerow([idx, row['department_name'], row['description'], row['active_flag']])

#             return response

#         # Pagination logic
#         starting = offset + 1 if total_rows > 0 else 0
#         ending = offset + len(departments)
#         total_pages = (total_rows + limit - 1) // limit
#         pagination = range(1, total_pages + 1)

#         return render(request, 'backend/department/department.html', {
#             'page_title': 'Department List',
#             'departments': departments,
#             'activeFlag': activeFlag,
#             'department_name': department_name,
#             'active_flag': active_flag,
#             'starting': starting,
#             'ending': ending,
#             'totalRows': total_rows,
#             'pagination': pagination,
#             'current_page': page,
#             'limit': limit,
#             'limit_options': [10, 20, 50, 100],
#         })

class DepartmentImportView(View):
    def get(self, request):
        # Render the form for uploading the CSV file
        return render(request, 'backend/department/import.html')

    def post(self, request):
        csv_file = request.FILES['csv_file']

        if not csv_file.name.endswith('.csv'):
            # If the uploaded file is not a CSV
            return HttpResponse("Invalid file format. Please upload a CSV file.")

        decoded_file = csv_file.read().decode('utf-8').splitlines()
        reader = csv.reader(decoded_file)

        # Skip the header row
        next(reader)

        for row in reader:
            department_name, description, active_flag = row

            # Create or update department using the serializer
            department_data = {
                'department_name': department_name,
                'description': description,
                'active_flag': active_flag
            }

            # Use the serializer to save or update department
            serializer = DepartmentSerializer(data=department_data)

            if serializer.is_valid():
                # Check if department already exists by name (or other unique field)
                department, created = Department.objects.get_or_create(
                    department_name=department_name,
                    defaults=department_data
                )
                # No need to keep track of created/updated count anymore
            else:
                # Handle invalid data, if needed
                continue

        # Redirect or render a simple success message
        return HttpResponse("Departments have been successfully imported.")

class DepartmentListView(View):
    def get(self, request):
        department_name = request.GET.get('department_name', '').strip()
        active_flag = request.GET.get('active_flag', '')
        limit = request.GET.get('limit', 10)
        page = request.GET.get('page', 1)
        export = request.GET.get('export', None)

        departments = Department.objects.all()

        if department_name:
            departments = departments.filter(department_name__icontains=department_name)

        if active_flag:
            departments = departments.filter(active_flag=active_flag)

        # 🛑 Fix: Check export first
        if export:
            return self.export_departments(departments)

        # Pagination (only if not exporting)
        totalRows = departments.count()

        paginator = Paginator(departments, limit)
        try:
            departments_page = paginator.page(page)
        except:
            departments_page = paginator.page(1)

        starting = departments_page.start_index()
        ending = departments_page.end_index()

        pagination = paginator.page_range

        list_name = 'ACTIVESTATUS'
        active_flag_list = lov(list_name)

        context = {
            'page_title': 'Department Management',
            'departments': departments_page,
            'department_name': department_name,
            'active_flag': active_flag,
            'starting': starting,
            'ending': ending,
            'totalRows': totalRows,
            'current_page': int(page),
            'pagination': pagination,
            'limit': int(limit),
            'limit_options': [10, 20, 50, 100],
            'activeFlag': active_flag_list,
        }

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return render(request, 'backend/department/department_list_partial.html', context)
        else:
            return render(request, 'backend/department/department.html', context)

    def export_departments(self, departments):


        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="departments.csv"'

        writer = csv.writer(response)
        writer.writerow(['S.No', 'Department Name', 'Description', 'Active Status'])

        for index, dept in enumerate(departments, start=1):
            active_status = "Yes" if dept.active_flag == 'Y' else "No"  # Check the active flag
            writer.writerow([index, dept.department_name, dept.description, active_status])

        return response

class DepartmentCreateView(View):
    def get(self, request):
        context = {
            'action': 'add',
            'page_title': 'Create Department'
        }
        return render(request, 'backend/department/department.html', context)

    def post(self, request):
        serializer = DepartmentSerializer(data=request.POST)
        if serializer.is_valid():
            department = serializer.save()
            return redirect('edit_view_department', pk=department.pk)
        else:
            context = {
                'action': 'add',
                'errors': serializer.errors,
                'page_title': 'Create Department'
            }
            return render(request, 'backend/department/department.html', context)

class DepartmentEditView(View):
    def get(self, request, pk):
        department = get_object_or_404(Department, pk=pk)
        context = {
            'action': 'edit',
            'department': department,
            'page_title': f'Edit Department: {department.department_name}'
        }
        return render(request, 'backend/department/department.html', context)

    def post(self, request, pk):
        department = get_object_or_404(Department, pk=pk)
        serializer = DepartmentSerializer(department, data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return redirect('edit_view_department', pk=pk)
        else:
            context = {
                'action': 'edit',
                'department': department,
                'errors': serializer.errors
            }
            return render(request, 'backend/department/department.html', context)

class DepartmentStatusUpdateView(View):
    def get(self, request, pk):
        department = get_object_or_404(Department, pk=pk)

        # Toggle the active status
        department.active_flag = 'N' if department.active_flag == 'Y' else 'Y'

        # Save the department object after updating its status
        department.save()

        # Redirect back to the list of departments
        return redirect('list_departments')

def manageSetups(request):
    page_title = 'Setups'

    return render(request, 'backend/setups/setups.html', {'page_title': page_title})


def manageDesignation(request, action=None, id=None):
    page_title = 'Designation'
    if action == 'add':

        if request.method == 'POST':

            designation_name    = request.POST.get('designation_name')
            description         = request.POST.get('description')

            query = designation_models.insert_designation()
            execute_sql(query, [designation_name, description])
            return redirect('list_designations')

        return render(request, 'backend/designation/designation.html', {'action': 'add'})

    elif (action == 'edit' or action == 'view') and id:
        if request.method == 'POST':
            designation_name = request.POST.get('designation_name')
            description = request.POST.get('description')

            query = designation_models.update_designation()
            execute_sql(query, [designation_name, description, id])
            return redirect('list_designations')

        query = designation_models.select_one_designation()
        designation = execute_sql(query, [id])[0]
        return render(request, 'backend/designation/designation.html', {'action': action, 'data': designation})


    elif action == 'status' and id:
        status = request.GET.get('status')  # 'Y' or 'N'
        date_time = get_current_datetime()

        if status == 'Y':
            data = {
                'active_flag': 'Y',
                'inactive_date': None,
                'last_updated_by': '',
                'last_updated_date': date_time,
            }
        else:
            data = {
                'active_flag': 'N',
                'inactive_date': date_time,
                'last_updated_by': '',
                'last_updated_date': date_time,
            }

        query = designation_models.update_designation_status()

        execute_sql(query, [
            data['active_flag'],
            data['inactive_date'],
            data['last_updated_by'],
            data['last_updated_date'],
            id
        ])
        return redirect(request.META.get('HTTP_REFERER', 'list_designation'))

    else:
        list_name = 'ACTIVESTATUS'
        activeFlag = lov(list_name)

        designation_name    = request.GET.get('designation_name', '')
        active_flag         = request.GET.get('active_flag', '')
        page                = int(request.GET.get('page', 1))
        limit               = int(request.GET.get('limit', 10))
        offset              = (page - 1) * limit

        # Count query
        count_query, count_params = designation_models.get_filtered_designations(
            designation_name=designation_name,
            active_flag=active_flag,
            count_only=True
        )
        total_rows = execute_sql(count_query, count_params)[0]['total']

        # Data query
        data_query, data_params = designation_models.get_filtered_designations(
            designation_name    = designation_name,
            active_flag         = active_flag,
            limit               = limit,
            offset              = offset
        )
        designation = execute_sql(data_query, data_params)


        starting = offset + 1 if total_rows > 0 else 0
        ending = offset + len(designation)
        total_pages = (total_rows + limit - 1) // limit
        pagination = range(1, total_pages + 1)

        return render(request, 'backend/designation/designation.html', {
            'page_title'        : page_title,
            'designation'       : designation,
            'activeFlag'        : activeFlag,
            'designation_name'  : designation_name,
            'active_flag'       : active_flag,
            'starting'          : starting,
            'ending'            : ending,
            'totalRows'         : total_rows,
            'pagination'        : pagination,
            'current_page'      : page,
            'limit'             : limit,
            'limit_options'     : [10, 20, 50, 100],
        })
