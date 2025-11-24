from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Department)
admin.site.register(Designation)
admin.site.register(Lov)
admin.site.register(ListTypeValues)
admin.site.register(Roles)
admin.site.register(ProjectsHeader)
admin.site.register(ProjectsLine)
admin.site.register(BloodGroup)
admin.site.register(Country)
admin.site.register(State)
admin.site.register(City)
admin.site.register(Location)
admin.site.register(Employees)
admin.site.register(UserLine)