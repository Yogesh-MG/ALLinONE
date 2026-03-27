echo -e "\033[0;32mStarting backend server...\033[0m"
source "C:/Users/yoge8/OneDrive/Desktop/Major project/medical-editable/env/scripts/activate"
echo -e "\033[0;32mActivated virtual environment.\033[0m"
pip freeze > requirements.txt
echo -e "\033[0;32mNavigating to pumpos-backend directory...\033[0m"
cd backend

echo -e "\033[0;33mChoose the Option to run the Django commands\033[0m"
echo -e "\033[0;33m1. Run Migrations\033[0m"
echo -e "\033[0;33m2. Start Server\033[0m"
echo -e "\033[0;33m3. Both with makemigration\033[0m"
echo -e "\033[0;33m4. Create SuperUser\033[0m"
echo -e "\033[0;33m5. Generate the dumy data\033[0m"
read -p "Enter your choice (1 or 2 or 3 or 4 or 5): " choice

if [ "$choice" == "1" ]; then
    echo -e "\033[0;32mRunning migrations...\033[0m"
    python manage.py makemigrations
    python manage.py migrate
elif [ "$choice" == "3" ]; then
    echo -e "\033[0;32mRunning makemigrations and migrations...\033[0m"
    python manage.py makemigrations
    python manage.py migrate
elif [ "$choice" == "2" ]; then
    echo -e "\033[0;32mStarting Django development server...\033[0m"
    python manage.py runserver 0.0.0.0:8000
elif [ "$choice" == "4" ]; then
    echo -e "\033[0;32mCreating SuperUser...\033[0m"
    python manage.py createsuperuser
elif [ "$choice" == "5" ]; then
    echo -e "\033[0;32mCreating SuperUser...\033[0m"
    python manage.py seed
elif [ "$choice" != "2" ]; then
    echo -e "\033[0;31mInvalid choice. Exiting.\033[0m"
    exit 1
fi