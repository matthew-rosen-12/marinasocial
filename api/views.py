from .models import Topic, Entry, Client, Team, Thread, Archives
from .serializers import ClientSerializer, EntrySerializer, TeamSerializer, ArchivesSerializer, TopicSerializer, EntrySerializerWithVote

from django.shortcuts import render

from frontendOld.templates.accounts.decorators import authenticated_user, allowed_users
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view

from rest_framework.response import Response
from django.http import JsonResponse, HttpResponse

from rest_framework import viewsets, permissions, generics
from rest_framework.views import APIView

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['POST'])
def entries_create(request):

	serializer = EntrySerializer(data=request.data, many = True)
	if serializer.is_valid():
		pThread = Thread.objects.create(no_entries=1)
		pThread.save()
		serializer.save(client=request.user.client, parentThread=pThread)

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['POST'])
def entries_create_pThread(request, ent):
	team = request.user.client.team
	clients = team.client_set.all()
	ogEntry = Entry.objects.filter(client__in=clients).get(id=ent)
	if ogEntry is not None:
		serializer = EntrySerializer(data=request.data, many = True)
		if serializer.is_valid():
			pThread = ogEntry.parentThread
			pThread.no_entries = pThread.no_entries+1
			pThread.save()
			serializer.save(client=request.user.client, parentThread=pThread)

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['POST'])
def entries_create_cThread(request, ent):
	team = request.user.client.team
	clients = team.client_set.all()
	ogEntry = Entry.objects.filter(client__in=clients).get(id=ent)
	if ogEntry is not None:
		serializer = EntrySerializer(data=request.data, many = True)
		if serializer.is_valid():
			cThread = Thread.objects.create(no_entries=2)
			cThread.save()
			ogEntry.childThread=cThread
			ogEntry.save()
			serializer.save(client=request.user.client, parentThread=cThread)

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['GET'])
def entries_pThread_list(request, ent):
	client = request.user.client
	entry = client.entry_set.all().get(id=ent)
	pThread = entry.parentThread
	entries = pThread.entry_set.all()

	serializer = EntrySerializer(entries, many = True)

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['GET'])
def entries_cThread_list(request, ent):
	client = request.user.client
	entry = client.entry_set.all().get(id=ent)
	cThread = entry.childThread
	entries = cThread.entry_set.all()

	serializer = EntrySerializer(entries, many = True)

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['GET'])
def client_detail(request):
	client = request.user.client
	serializer = ClientSerializer(instance=client, many = False)

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['GET'])
def client_team_detail(request):
	team = request.user.client.team
	clients = team.client_set.all()

	serializer = ClientSerializer(clients, many = True)

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['GET'])
def team_detail(request):
	team = request.user.client.team
	serializer = TeamSerializer(instance=team, many = False)

	return Response(serializer.data)


@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['GET'])
def entries_list(request):

	team = request.user.client.team
	clients = team.client_set.all()

	entries = Entry.objects.filter(client__in=clients).all()
	entries = sorted(entries, reverse = True, key=lambda a: a.und_score)
	
	currUser = request.user
	context = {"currUser": currUser}

	serializer = EntrySerializerWithVote(entries, many = True, context=context)

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['POST'])
def entries_update(request, ent):
	client = request.user.client
	entry = client.entry_set.all().get(id=ent)
	cThread = entry.childThread
	pThread = entry.parentThread
	serializer = EntrySerializer(instance=entry, data=request.data)
	if serializer.is_valid():
		serializer.save(client=request.user.client, childThread=cThread, parentThread=pThread)
	print(serializer.errors)
	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['DELETE'])
def entries_delete(request,ent):
	client = request.user.client
	print(client)
	entry = client.entry_set.all().get(id=ent)
	entry.delete()

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['GET'])
def entries_und(request,und,ent):
	curUser = request.user
	entry = Entry.objects.get(id=ent)
	team = curUser.client.team

	if entry.client.team == team:
		if und == 1:
			entry.upvote(curUser)
			entry.save()
		if und == 2:
			entry.downvote(curUser)
			entry.save()

		serializer = EntrySerializer(instance=entry, many=False)
		return Response(serializer.data)

	topicM = Topic.objects.filter(entryA=entry) | Topic.objects.filter(entryB=entry) 
	topic = topicM[0]
	if team == topic.voter1 or team == topic.voter2:
		if und == 1:
			entry.upvote(curUser)
			entry.save()
		if und == 2:
			entry.downvote(curUser)
			entry.save()

		serializer = EntrySerializer(instance=entry, many=False)
		return Response(serializer.data)

	serializer = TeamSerializer(instance=team, many = False)
	return Response(serializer.data)


@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['GET'])
def voting_entries_list(request):

	team = request.user.client.team

	topicM = Topic.objects.filter(voter1=team) | Topic.objects.filter(voter2=team) 
	topic = topicM[0]
	entries = [topic.entryA, topic.entryB]
	currUser = request.user
	context = {"currUser": currUser}
	serializer = EntrySerializerWithVote(entries, many = True, context=context)

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['GET'])
def topic_detail(request):

	team = request.user.client.team

	topicM = Topic.objects.filter(voter1=team) | Topic.objects.filter(voter2=team) 
	topic = topicM[0]
	serializer = TopicSerializer(instance=topic, many = False)

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['GET'])
def topic_detail_teams(request):

	team = request.user.client.team

	topicM = Topic.objects.filter(teamA=team) | Topic.objects.filter(teamB=team) 
	topic = topicM[0]
	serializer = TopicSerializer(instance=topic, many = False)

	return Response(serializer.data)

@login_required(login_url='login')
@allowed_users(allowed_roles=['user'])
@api_view(['GET'])
def voting_teams_list(request):

	team = request.user.client.team

	topicM = Topic.objects.filter(voter1=team) | Topic.objects.filter(voter2=team) 
	topic = topicM[0]
	teams = [topic.voter1, topic.voter2]
	serializer = TeamSerializer(teams, many = True)

	return Response(serializer.data)

@api_view(['GET'])
def archives_list(request):

	archives = Archives.objects.all() 
	serializer = ArchivesSerializer(archives, many = True)

	return Response(serializer.data)

@api_view(['GET'])
def team_of_entry(request, ent):

	entry = Entry.objects.get(id=ent)
	print(entry)
	team = entry.client.team
	print(team)
	serializer = TeamSerializer(instance=team, many=False)

	return Response(serializer.data)