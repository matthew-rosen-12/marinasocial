from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
# from .models import Entry


# class EntryForm(forms.ModelForm):
# 	string = forms.CharField(widget=forms.Textarea(attrs={"placeholder": "Your submissiion here"}))
# 	class Meta:
# 		model = Entry
# 		fields =[
# 			'string',
# 		]

	# def clean_creator(self, *args, **kwargs):
	# 	creator = self.cleaned_data.get("creator")
	# 	if not creator.endswith('.edu'):
	# 		raise forms.ValidationError("This is not a valid email")
	# 	return creator

class CreateUserForm(UserCreationForm):
	class Meta:
		model = User
		fields = ['username','email','password1','password2']
		