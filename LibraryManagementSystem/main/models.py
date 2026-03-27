from django.db import models
from django.contrib.auth.models import AbstractUser,Group, Permission
from phonenumber_field.modelfields import PhoneNumberField
from django.db.models.signals import pre_save
from django.dispatch import receiver
from datetime import datetime



# Create your models here.
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    books_taken = models.PositiveIntegerField(default=0)
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_groups',  # Ensure unique related name
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',  # Ensure unique related name
        blank=True,
    )
    
    
    

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, unique=True)
    USN = models.CharField(max_length=10, default="1ST")
    phone = PhoneNumberField(blank=True)
    
    def __str__(self) -> str:
        return f"{self.user.username}.{self.USN}"
    
class Teacher(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, unique=True)
    teacher_id = models.CharField(max_length=10)
    
    def __str__(self) -> str:
        return f"{self.user.username}.{self.teacher_id}"
    
    
    
class Books(models.Model):
    book_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    version = models.IntegerField()
    number_of_copies = models.IntegerField(default=1)
    
    def __str__(self) -> str:
        return f"{self.name}.{self.book_id}"
    
    @property
    def copies_available(self):
        """Calculate available copies based on issued books."""
        issued_count = BookIssue.objects.filter(book=self, returned=False).count()
        return self.number_of_copies - issued_count

    def save(self, *args, **kwargs):
        # Ensure number_of_copies is valid (not negative)
        if self.number_of_copies < 0:
            raise ValueError("Number of copies cannot be negative.")
        super().save(*args, **kwargs)
    
class BookIssue(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    book = models.ForeignKey(Books, on_delete=models.SET_NULL, null=True)
    issue_date = models.DateTimeField(auto_now_add=True)
    due_data = models.DateTimeField(null=True, blank=True)
    returned = models.BooleanField(default=False)
    fine_amount = models.IntegerField(default=0)
    
    def __str__(self) -> str:
        return f"{self.book.book_id} --- {self.book.name} --- {self.fine_amount}"
    def clean(self):
        """Ensure that books cannot be issued if none are available."""
        if not self.returned and self.book.copies_available <= 0:
            raise ValueError("No copies available to issue this book.")

    def save(self, *args, **kwargs):
        # Check if this is a new issue
        if not self.pk:  # New issue
            if not self.returned and self.book.copies_available <= 0:
                raise ValueError("No copies available to issue this book.")
            self.user.books_taken += 1  # Increment books_taken for the user
            self.user.save()
        else:
            # If the book is returned, update the count
            previous_instance = BookIssue.objects.get(pk=self.pk)
            if previous_instance.returned is False and self.returned is True:
                self.user.books_taken -= 1
                self.user.save()
        super().save(*args, **kwargs)

    
@receiver(pre_save, sender=BookIssue)
def calculate_fine(sender, instance, **kwargs):
    if not instance.returned and instance.due_data:
        overdue_days = (datetime.now() - instance.due_data).days
        if overdue_days > 0:
            instance.fine_amount = overdue_days * 50
        else:
            instance.fine_amount = 0

            
    