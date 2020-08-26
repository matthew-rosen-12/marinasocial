from .forms import CreateUserForm


from django.shortcuts import render, redirect
from django.contrib import messages

from django.contrib.auth import authenticate, login, logout

from .templates.accounts.decorators import authenticated_user
from django.contrib.auth.decorators import login_required

# Create your views here.

def signup_view(request):
	form = CreateUserForm()

	if request.method == "POST":
		form = CreateUserForm(request.POST)
		if form.is_valid():
			user =form.save()

			username = form.cleaned_data.get('username')

			messages.success(request, 'Account was created for ' + username)

			return redirect('/login/')


	context = {'form': form}
	return render(request,'accounts/signup.html',context)

@authenticated_user
def login_view(request):
	if request.method == "POST":
		username = request.POST.get('username')
		password = request.POST.get('password')

		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return redirect('/home/')
		else:
			messages.info(request, 'Username or password is incorrect')

	context = {}
	return render(request, 'accounts/login.html',context)

def logout_view(request):
	logout(request)
	return redirect('/login/')