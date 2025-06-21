# ==============================================================================
# itiva_project/itiva_app/admin.py
#
# Registers your models with the Django admin interface, making them
# manageable by the admin user.
# ==============================================================================

from django.contrib import admin
from .models import (
    User, Business, Question, Option, 
    MarkingGrid, Recommendation, UserAnswer, VAResult
)

class OptionInline(admin.TabularInline):
    model = Option
    extra = 1

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'category')
    list_filter = ('category',)
    inlines = [OptionInline]

class BusinessAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'user', 'address')

class VAResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'overall_score', 'created_at')
    readonly_fields = ('created_at',)

# Register your models here.
admin.site.register(User)
admin.site.register(Business, BusinessAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Option)
admin.site.register(MarkingGrid)
admin.site.register(Recommendation)
admin.site.register(UserAnswer)
admin.site.register(VAResult, VAResultAdmin)