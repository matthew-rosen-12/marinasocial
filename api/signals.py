from django.contrib.auth.models import User, Group
from django.db.models.signals import post_save, pre_delete
from .models import Client, Team, Entry, Topic, Archives
import random, string

max_participants = 5


def create_client(sender, instance, created, **kwargs):
	 
	 if created:
	 	group = Group.objects.get(name='user')
	 	instance.groups.add(group)

	 	# assign to teams
	 	team = Team.objects.order_by('no_participants').first()
	 	if team is None or team.no_participants >  max_participants:
	 		name = random.choice(string.ascii_letters) + random.choice(string.ascii_letters) + random.choice(string.ascii_letters)
	 		team = Team.objects.create(name = name, no_participants=1)

	 	else:
	 		team.no_participants = team.no_participants+1
	 		team.save()

	 	Client.objects.create(user=instance, name=instance.username, team = team)

post_save.connect(create_client, sender=User)

def deleted_client(sender, instance, **kwargs):

	team = instance.team
	team.no_participants = team.no_participants -1
	team.save()

pre_delete.connect(deleted_client, sender=Client)

def deleted_topic(sender, instance, **kwargs):

	topic = instance.string
	entryA = instance.entryA.string
	entryB = instance.entryB.string
	teamA = instance.entryA.client.team.name
	teamB = instance.entryB.client.team.name
	AWon = True
	if instance.entryA.und_score<instance.entryB.und_score:
		AWon = False
	

	Archives.objects.create(topic=topic,entryA=entryA,entryB=entryB,teamA=teamA,teamB=teamB)

pre_delete.connect(deleted_topic, sender=Topic)

def deleted_entry(sender, instance, **kwargs):

	cThread = instance.childThread
	pThread = instance.parentThread
	pThread.no_entries = pThread.no_entries-1
	if cThread != None:
		cThread.no_entries = cThread.no_entries - 1
		if cThread.no_entries == 0:
			cThread.delete()

pre_delete.connect(deleted_entry, sender=Entry)


# test order by
# try pre delete to decrease empty team