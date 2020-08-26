from django.urls import path
from . import views

urlpatterns = [
	path('entries-list/', views.entries_list, name='entries-list'),
	path('entries-create/', views.entries_create, name='entries-create'),
	path('entries-update/<str:ent>/', views.entries_update, name='entries-update'),
	path('entries-delete/<str:ent>/', views.entries_delete, name='entries-delete'),

	path('entries-pThread-list/<str:ent>/', views.entries_pThread_list, name='entries-pThread-list'),
	path('entries-cThread-list/<str:ent>/', views.entries_cThread_list, name='entries-cThread-list'),

	path('<int:und>/<str:ent>/', views.entries_und, name='entries-und'),

	path('client-detail/', views.client_detail, name='client-detail'),
	path('client-team-detail/', views.client_team_detail, name='client-team-detail'),
	path('team-detail/', views.team_detail, name='team-detail'),


	path('entries-create-pThread/<str:ent>/', views.entries_create_pThread, name='entries-create-pThread'),
	path('entries-create-cThread/<str:ent>/', views.entries_create_cThread, name='entries-create-cThread'),

	path('voting-entries-list/', views.voting_entries_list, name='voting-entries-list'),
	path('voting-teams-list/', views.voting_teams_list, name='voting-teams-list'),

	path('archives-list/', views.archives_list, name='archives-list'),

	path('team-of-entry/<str:ent>/', views.team_of_entry, name='team-of-entry'),

	path('topic-detail/', views.topic_detail, name='topic-detail'),
	path('topic-detail-teams/', views.topic_detail_teams, name='topic-detail-teams'),

]