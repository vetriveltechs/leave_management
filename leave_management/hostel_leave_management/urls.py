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

from django.urls import path

# from .views import employee_details_list, employee_details_detail

from .views import *

urlpatterns = [

     path('', dashboard, name='dashboard'),
     path('departments/', DepartmentListView.as_view(), name='list_departments'),
    path('departments/create/', DepartmentCreateView.as_view(), name='add_department'),
    path('departments/edit/<int:pk>/', DepartmentEditView.as_view(), name='edit_view_department'),
    path('departments/import/', DepartmentImportView.as_view(), name='import_departments'),
    path('departments/status/<int:pk>/', DepartmentStatusUpdateView.as_view(), name='status_update_department'),
    path('setups/', manageSetups, name='setups'),  # Edit or view
    path('designation/', manageDesignation, name='list_designation'),  # Default listing
    path('designation/<str:action>/', manageDesignation, name='add_designation'),  # Add or view
    path('designation/<str:action>/<int:id>/', manageDesignation, name='edit_view_designation'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
