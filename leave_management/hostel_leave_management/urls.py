"""myproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static


from django.contrib import admin

from django.urls import path, include

# from .views import employee_details_list, employee_details_detail

from .views import *

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'designations', DesignationViewSet, basename='designation')
router.register(r'lov', LovViewSet, basename='lov')  
router.register(r'list-type-values', ListTypeValuesViewSet, basename='list-type-values')
# router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'projects', ProjectsHeaderViewSet, basename='projects')
router.register(r'roles', RolesViewSet, basename='roles')
router.register(r'departments', DepartmentViewSet)
router.register(r'bloodGroups', BloodGroupViewSet, basename='bloodgroup')
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'states', StateViewSet, basename='state')
router.register(r'cities', CityViewSet, basename='city')
router.register(r'locations', LocationViewSet, basename='locations')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'users', UserViewSet, basename='users')


urlpatterns = [
    path('', login_view, name='login'),
    
    path('dashboard', dashboard, name='dashboard'),
    path('api/', include(router.urls)),  
    path('setups', manageSetups, name='setups'),
    
    path('projects', project_list, name='projects'),
    
    path('employee-list', employee_form_view, name='employee-list'),
    
    path('users-list', users_form_view, name='users-list'),
    
    path('country-list', country_form_view, name='country-list'),
    
    path('state-list', state_form_view, name='state-list'),
    
    path('city-list', city_form_view, name='city-list'),
    
    path('location-list', location_form_view, name='location-list'),
    
    path('blood-group-list', blood_group_form_view, name='blood-group-list'),
    
    path('roles-list', roles_form_view, name='roles-list'),
    
    path('lov-form', lov_view, name='lov-form'),
    
    path('lov/list-type-values-list/<int:lov_id>/', list_type_values_list_view, name='list-type-values-list'),

    path('roles/getRoles/', get_roles , name='get_roles'),
    
    path('get_employee', get_employee, name='get_employee'),
    
    path('designation-form', designation_form_view, name='designation-form'),
    
    path('department-list', department_form_view, name='department-list'),
    
    path('get_states_by_country', get_states_by_country, name='get_states_by_country'),
    
    path('get_cities_by_state', get_cities_by_state, name='get_cities_by_state'),
    
    path('users/updateLineStatus/', update_user_line_status, name='update_line_status'),
    
    path('logout', logout_view, name='logout'),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
