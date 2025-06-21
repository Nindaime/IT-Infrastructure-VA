# ==============================================================================
# itiva_project/itiva_app/management/commands/import_data.py
#
# A custom Django command to populate the database from the CSV files.
# Usage: `python manage.py import_data`
# Place this file in: itiva_app/management/commands/
# Make sure to create the __init__.py files in the management and commands folders.
# ==============================================================================

import csv
from django.core.management.base import BaseCommand
from django.db import transaction
from itiva_app.models import Question, Option, MarkingGrid, Recommendation

class Command(BaseCommand):
    help = 'Imports data from questionnaire, marking grid, and recommendation CSV files.'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("Deleting old data...")
        Question.objects.all().delete()
        
        # --- Import Questionnaire and Options ---
        self.stdout.write("Importing questionnaire...")
        with open('../../../Knowledge Base/questionnaire.csv', 'r') as f:
            reader = csv.DictReader(f)
            questions_cache = {}
            options_cache = {}
            for row in reader:
                question_text = row['Question']
                if question_text not in questions_cache:
                    # Determine category from question number (simple logic)
                    q_num = len(questions_cache) + 1
                    if 1 <= q_num <= 8: cat = 'WS'
                    elif 9 <= q_num <= 15: cat = 'DN'
                    elif 16 <= q_num <= 21: cat = 'CD'
                    else: cat = 'CS'
                    
                    question = Question.objects.create(text=question_text, category=cat)
                    questions_cache[question_text] = question
                
                question = questions_cache[question_text]
                
                for i in range(1, 6): # Options A-E
                    option_text = row[f'Option {chr(64 + i)}']
                    if option_text:
                        opt = Option.objects.create(question=question, text=option_text)
                        # Cache the option by its text and question id for easy lookup
                        options_cache[(question.id, option_text)] = opt

        self.stdout.write(f"Imported {Question.objects.count()} questions and {Option.objects.count()} options.")

        # --- Import Marking Grid ---
        self.stdout.write("Importing marking grid...")
        with open('../../../Knowledge Base/marking_grid.csv', 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    q = Question.objects.get(id=int(row['Question Number']))
                    opt_text = row['Option Text']
                    opt = Option.objects.get(question=q, text=opt_text)
                    MarkingGrid.objects.create(
                        option=opt,
                        score=int(row['Score']),
                        explanation=row['Explanation']
                    )
                except (Question.DoesNotExist, Option.DoesNotExist, KeyError, ValueError) as e:
                    self.stderr.write(f"Skipping row in marking_grid.csv due to error: {e}. Row: {row}")
                    
        self.stdout.write(f"Imported {MarkingGrid.objects.count()} marking grid entries.")

        # --- Import Recommendations ---
        self.stdout.write("Importing recommendations...")
        with open('../../../Knowledge Base/recommendations.csv', 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    q = Question.objects.get(id=int(row['Question Number']))
                    opt_text = row['Option Text']
                    opt = Option.objects.get(question=q, text=opt_text)
                    Recommendation.objects.create(
                        option=opt,
                        recommendation_text=row['Recommendation']
                    )
                except (Question.DoesNotExist, Option.DoesNotExist, KeyError, ValueError) as e:
                    self.stderr.write(f"Skipping row in recommendations.csv due to error: {e}. Row: {row}")

        self.stdout.write(f"Imported {Recommendation.objects.count()} recommendation entries.")
        self.stdout.write(self.style.SUCCESS('Data import complete.'))

