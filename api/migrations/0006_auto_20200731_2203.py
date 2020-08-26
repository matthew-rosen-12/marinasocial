# Generated by Django 3.0.7 on 2020-07-31 22:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20200729_2335'),
    ]

    operations = [
        migrations.CreateModel(
            name='Archives',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('topic', models.CharField(max_length=120)),
                ('entryA', models.CharField(max_length=120)),
                ('entryB', models.CharField(max_length=120)),
                ('teamA', models.CharField(max_length=50)),
                ('teamB', models.CharField(max_length=50)),
                ('AWon', models.BooleanField(default=True)),
            ],
        ),
        migrations.AddField(
            model_name='topic',
            name='string',
            field=models.CharField(default='Reality TV SHOW', max_length=120),
            preserve_default=False,
        ),
    ]