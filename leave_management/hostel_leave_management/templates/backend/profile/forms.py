# yourappname/forms.py

from django import forms

class ProfileForm(forms.Form):
    product_name = forms.CharField(max_length=100, required=True)
    category = forms.ChoiceField(choices=[(0, '--Select--'), (1, 'Germany'), (2, 'Canada'), (3, 'USA'), (4, 'Australia')], required=True)
    product_code = forms.IntegerField(required=True)
    user_name = forms.CharField(max_length=100, required=True)
    password = forms.IntegerField(required=True)
    url = forms.URLField(required=True)
    description = forms.CharField(widget=forms.Textarea, required=False)
    image = forms.ImageField(required=False)
    country = forms.ChoiceField(choices=[(0, '--Select--'), (1, 'Germany'), (2, 'Canada'), (3, 'USA'), (4, 'Australia')], required=False)
