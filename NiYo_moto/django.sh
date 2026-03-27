#!/bin/bash
echo "Starting Django commands..."
source env/Scripts/activate
cd backend

printf "\033[33mDo you want to run server(run)\nTo make migrations(make)\nTo apply migrations(migrate)\nto generate static files(static)\nto create new app(app) \033[0m"
read -r django_command
ls
if [ "$django_command" = "run" ]; then
    python manage.py runserver 0.0.0.0:8000
elif [ "$django_command" = "make" ]; then
    python manage.py makemigrations
elif [ "$django_command" = "migrate" ]; then
    python manage.py migrate
elif [ "$django_command" = "static" ]; then
    python manage.py collectstatic
elif [ "$django_command" = "user" ]; then
    python manage.py createsuperuser
elif [ "$django_command" = "app" ]; then
    printf "\033[33mEnter the name of the new app: \033[0m"
    read -r app_name
    python manage.py startapp "$app_name"
    cd "$app_name"
    touch serializers.py
    touch urls.py
    cd ..
      echo " App '$app_name' created with serializers.py and urls.py files.\name
    include the app in your project's settings.py file under INSTALLED_APPS. as "$app_name".apps."$app_name"Config"
else
    echo "Invalid command. Please enter 'run', 'make', 'migrate', or 'static'."
fi
deactivate  
