from django.core.management.base import BaseCommand
from seed import seed_data
class Command(BaseCommand):
    help = 'Seed the database with dummy data'

    def handle(self, *args, **kwargs):
        seed_data()
