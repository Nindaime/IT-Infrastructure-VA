# ==============================================================================
# itiva_project/itiva_app/models.py
#
# Defines the database schema for the application.
# This matches the architecture document exactly.
# ==============================================================================

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # The default User model already has email, username, password.
    full_name = models.CharField(max_length=255, blank=True)

class Business(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    business_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    address = models.CharField(max_length=512)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return self.business_name

class Question(models.Model):
    CATEGORY_CHOICES = [
        ('WS', 'Website Strength'),
        ('DN', 'Devices & Network'),
        ('CD', 'Compliance Documentation'),
        ('CS', 'Cyber Security Implementations'),
    ]
    text = models.TextField()
    category = models.CharField(max_length=2, choices=CATEGORY_CHOICES)

    def __str__(self):
        return f"{self.get_category_display()}: {self.text[:50]}..."

class Option(models.Model):
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    text = models.CharField(max_length=512)

    def __str__(self):
        return self.text

class MarkingGrid(models.Model):
    option = models.OneToOneField(Option, on_delete=models.CASCADE)
    score = models.IntegerField()
    explanation = models.TextField()

class Recommendation(models.Model):
    option = models.OneToOneField(Option, on_delete=models.CASCADE)
    recommendation_text = models.TextField()

class UserAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(Option, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=100) # Groups answers for a single assessment
    timestamp = models.DateTimeField(auto_now_add=True)

class VAResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=100, unique=True)
    website_score = models.IntegerField()
    network_score = models.IntegerField()
    compliance_score = models.IntegerField()
    cybersec_score = models.IntegerField()
    overall_score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result for {self.user.username} on {self.created_at.strftime('%Y-%m-%d')}"