from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from faker import Faker
import random
from datetime import timedelta
from gymnast.models import Member
from sales.models import Invoice, SalesDeal
from staff_management.models import StaffMember, Schedule, Resource

class Command(BaseCommand):
    help = 'Seeds the database with fake data for Users, Members, StaffMembers, Schedules, Resources, Invoices, and SalesDeals'

    def handle(self, *args, **kwargs):
        fake = Faker()
        Faker.seed(42)  # For reproducible results

        # Clear existing data
        User.objects.all().delete()
        Member.objects.all().delete()
        StaffMember.objects.all().delete()
        Schedule.objects.all().delete()
        Resource.objects.all().delete()
        Invoice.objects.all().delete()
        SalesDeal.objects.all().delete()

        self.stdout.write(self.style.SUCCESS('Cleared existing data'))

        # Create Users and Members
        members = []
        for i in range(20):
            user = User.objects.create_user(
                username=fake.email(),
                email=fake.email(),
                password='testpass123',
                first_name=fake.first_name(),
                last_name=fake.last_name(),
            )
            member = Member.objects.create(
                user=user,
                join_date=fake.date_between(start_date='-2y', end_date='today')
            )
            members.append(member)

        self.stdout.write(self.style.SUCCESS(f'Created {len(members)} Members'))

        # Create StaffMembers
        staff_members = []
        departments = ['Personal Training', 'Group Classes', 'Customer Service', 'Facilities']
        roles = [
            'Head Trainer', 'Yoga Instructor', 'Front Desk', 'Maintenance',
            'Fitness Coach', 'Pilates Instructor', 'Receptionist', 'Janitor'
        ]
        certifications = [
            ['NASM-CPT', 'Nutrition Specialist'],
            ['RYT-500', 'Meditation Coach'],
            ['Customer Service', 'First Aid'],
            ['Equipment Maintenance', 'Safety'],
            ['ACE-CPT', 'Group Fitness'],
            ['Pilates Certification', 'Rehabilitation']
        ]
        for i in range(15):
            user = User.objects.create_user(
                username=fake.email(),
                email=fake.email(),
                password='testpass123',
                first_name=fake.first_name(),
                last_name=fake.last_name(),
            )
            staff = StaffMember.objects.create(
                staff_id=f'STAFF-{1000 + i}',
                user=user,
                role=random.choice(roles),
                department=random.choice(departments),
                status=random.choice(['active', 'part-time', 'on-leave', 'inactive']),
                hours_week=random.randint(20, 50),
                phone=fake.phone_number(),
                email=user.email,
                join_date=fake.date_between(start_date='-3y', end_date='today'),
                certifications=random.choice(certifications),
                avatar='/placeholder.svg'
            )
            staff_members.append(staff)

        self.stdout.write(self.style.SUCCESS(f'Created {len(staff_members)} StaffMembers'))

        # Create Schedules
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        times = ['6:00 AM - 2:00 PM', '9:00 AM - 12:00 PM', '8:00 AM - 4:00 PM', '6:00 PM - 8:00 PM', '1:00 PM - 9:00 PM']
        schedule_types = ['Personal Training', 'Yoga Classes', 'Front Desk', 'Maintenance', 'Group Fitness']
        schedules = []
        for staff in staff_members:
            for _ in range(random.randint(2, 5)):
                schedule = Schedule.objects.create(
                    staff=staff,
                    day=random.choice(days),
                    time=random.choice(times),
                    type=random.choice(schedule_types)
                )
                schedules.append(schedule)

        self.stdout.write(self.style.SUCCESS(f'Created {len(schedules)} Schedules'))

        # Create Resources
        resources_data = [
            {'name': 'Gym Equipment', 'type': 'Equipment', 'status': 'available', 'location': 'Main Floor', 'maintenance': 'Up to date'},
            {'name': 'Yoga Studio A', 'type': 'Room', 'status': 'occupied', 'location': '2nd Floor', 'capacity': '25 people'},
            {'name': 'Personal Training Room 1', 'type': 'Room', 'status': 'available', 'location': '1st Floor', 'capacity': '2 people'},
            {'name': 'Swimming Pool', 'type': 'Facility', 'status': 'maintenance', 'location': 'Ground Floor', 'maintenance': 'Scheduled cleaning'},
            {'name': 'Cardio Machines', 'type': 'Equipment', 'status': 'available', 'location': 'Main Floor', 'maintenance': 'Up to date'},
            {'name': 'Group Fitness Studio', 'type': 'Room', 'status': 'occupied', 'location': '2nd Floor', 'capacity': '30 people'}
        ]
        resources = []
        for data in resources_data:
            resource = Resource.objects.create(**data)
            resources.append(resource)

        self.stdout.write(self.style.SUCCESS(f'Created {len(resources)} Resources'))

        # Create Invoices
        invoices = []
        for i in range(30):
            invoice = Invoice.objects.create(
                invoice_id=f'INV-{1000 + i}',
                member=random.choice(members),
                amount=random.uniform(50.00, 500.00),
                status=random.choice(['paid', 'pending', 'overdue']),
                plan=random.choice(['Basic', 'Premium', 'Enterprise']),
                issue_date=fake.date_between(start_date='-1y', end_date='today')
            )
            invoices.append(invoice)

        self.stdout.write(self.style.SUCCESS(f'Created {len(invoices)} Invoices'))

        # Create SalesDeals
        sales_deals = []
        for i in range(20):
            close_date = fake.date_between(start_date='today', end_date='+30d')
            deal = SalesDeal.objects.create(
                deal_id=f'DEAL-{1000 + i}',
                prospect=fake.company(),
                value=random.uniform(1000.00, 10000.00),
                stage=random.choice(['prospect', 'proposal', 'negotiation', 'closed-won', 'closed-lost']),
                probability=random.randint(10, 90),
                close_date=close_date
            )
            sales_deals.append(deal)

        self.stdout.write(self.style.SUCCESS(f'Created {len(sales_deals)} SalesDeals'))

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))