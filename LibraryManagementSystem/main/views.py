from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Books, CustomUser, BookIssue
import random

def home(request):
    return render(request, 'index.html')

@login_required(login_url='login')
def book_list(request):
    # Fetch the logged-in user's details
    user = request.user
    role = 'Teacher' if user.is_teacher else 'Student'
    query = request.GET.get('search', '')
    
    if query:
        books = Books.objects.filter(name__icontains=query)
    else:
        book_ids = list(Books.objects.values_list('id', flat=True))
        random_ids = random.sample(book_ids, min(len(book_ids), 6))  # Show up to 6 books
        books = Books.objects.filter(id__in=random_ids)
    
    book_data = []
    for book in books:
        book_info = {
            'book': book,
            'issued_students': None  # Default for students
        }
        if user.is_teacher and book.number_of_copies == 0:
            # Fetch all students who have borrowed this book
            issues = BookIssue.objects.filter(book=book, returned=False)
            issued_students = [{
                'student_name': issue.user.username,
                'email': issue.user.email,
                'phone': issue.user.phone_number,  # Ensure this field is in your CustomUser model
            } for issue in issues]
            book_info['issued_students'] = issued_students
        
        book_data.append(book_info)

    context = {
        'user': user,
        'role': role,
        'book_data': book_data,
    }
    return render(request, 'book_list.html', context)

def logins(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        
        try:
        
            user = CustomUser.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, "Logged in successfully!")
                return redirect('book_list') 
            else:
                messages.error(request, "Invalid credentials!")
        except CustomUser.DoesNotExist:
            messages.error(request, "No account found with this email!")
        
        return redirect('book_list')
    
    return render(request, 'signup.html')  


def logout_view(request):
    logout(request)
    messages.success(request, "logged out succesfully!")
    return redirect('home')