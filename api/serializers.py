from rest_framework import serializers
from .models import Client, Entry, Team, Topic, Archives, Topic
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ('id', 'name', 'team')

class EntrySerializerWithVote(serializers.ModelSerializer):
    currUserVoteField = serializers.SerializerMethodField()

    def get_currUserVoteField(self,obj):
    	currUser = self.context['currUser']
    	try:
    		currUserVote = obj._get_with_object(currUser)
    	except:
    		currUserVote = None
    	if currUserVote != None:
    		return currUserVote.score
    	return 0

    class Meta:
        model = Entry
        fields = ('string', 'client', 'id', 'und_score', 'parentThread', 'childThread', 'currUserVoteField')

class EntrySerializer(serializers.ModelSerializer):

    class Meta:
        model = Entry
        fields = ('string', 'client', 'id', 'und_score', 'parentThread', 'childThread')


class TeamSerializer(serializers.ModelSerializer):
	class Meta:
		model = Team
		fields = ('name', 'no_participants')

class ArchivesSerializer(serializers.ModelSerializer):
	class Meta:
		model = Archives
		fields = ('AWon','topic', 'entryA', 'entryB','teamA','teamB')

class TopicSerializer(serializers.ModelSerializer):
	class Meta:
		model = Topic
		fields = ('string','entriesComplete', 'entryA', 'entryB','voter1','voter2')