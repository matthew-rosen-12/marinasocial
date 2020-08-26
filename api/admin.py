from django.contrib import admin

# Register your models here.
from .models import Topic, Entry, Client, Team, Thread, Archives

from random import randint

admin.site.register(Entry)
admin.site.register(Thread)
admin.site.register(Archives)

def transfer_to_vote(modeladmin, request, queryset):
    for topic in queryset:
    	if topic.entriesComplete == False:
	    	topic.entriesComplete = True
	    	clientsA = topic.teamA.client_set.all()
	    	entriesA = Entry.objects.filter(client__in=clientsA)
	    	topEntryA = entriesA.order_by('-und_votes').first()
	    	topEntryA.und_score_up = 0
	    	topEntryA.und_score_down = 0
	    	topEntryA.save()
	    	topic.entryA = topEntryA
	    	clientsB = topic.teamB.client_set.all()
	    	entriesB = Entry.objects.filter(client__in=clientsB)
	    	topEntryB = entriesB.order_by('-und_votes').first()
	    	topEntryB.und_score_up = 0
	    	topEntryB.und_score_down = 0
	    	topEntryB.save()
	    	topic.entryB = topEntryB
	    	topic.save()


transfer_to_vote.short_description = "Set entriesComplete to True and find winners"

def assign_to_topic(modeladmin, request, queryset):
    for team in queryset:
    	if not hasattr(team, 'topic'):

    		topicId = -1

    		entryTopicQSetA = Topic.objects.filter(teamA = None)
    		if entryTopicQSetA.count() == 0:
    			entryTopicQSetB = Topic.objects.filter(teamB = None)
    			entryTopic = entryTopicQSetB[randint(0, entryTopicQSetB.count() - 1)]
    			entryTopic.teamB = team
    			entryTopic.save()
    			topicId = entryTopic.id
    		else:
    			entryTopic = entryTopicQSetA[randint(0, entryTopicQSetA.count() - 1)]
    			entryTopic.teamA = team
    			entryTopic.save()
    			topicId=entryTopic.id

    		voterTopicQSet1 = Topic.objects.filter(voter1 = None) & Topic.objects.exclude(id=topicId)
    		if voterTopicQSet1.count() == 0:
    			voterTopicQSet2 = Topic.objects.filter(voter2 = None) & Topic.objects.exclude(id=topicId)
    			voterTopic = voterTopicQSet2[randint(0, voterTopicQSet2.count() - 1)]
    			voterTopic.voter2 = team
    			voterTopic.save()
    		else:
    			voterTopic = voterTopicQSet1[randint(0, voterTopicQSet1.count() - 1)]
    			voterTopic.voter1 = team
    			voterTopic.save()			



assign_to_topic.short_description = "Assign teams to topics as voter and entrant"

class TopicAdmin(admin.ModelAdmin):
    list_display = ['string', 'entriesComplete', 'teamA', 'teamB', 'voter1', 'voter2']
    ordering = ['entriesComplete']
    actions = [transfer_to_vote]

class TeamAdmin(admin.ModelAdmin):
    list_display = ['name']
    ordering = ['name']
    actions = [assign_to_topic]

class ClientAdmin(admin.ModelAdmin):
    list_display = ['name']
    ordering = ['name']

admin.site.register(Team, TeamAdmin)
admin.site.register(Topic, TopicAdmin)
admin.site.register(Client, ClientAdmin)