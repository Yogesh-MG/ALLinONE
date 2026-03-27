#!/bin/bash
echo "Starting to execute the project commands"

read -p "Enter what section of the project you want to run (web/backend/app/desktop): " section

if [ "$section" = "web" ]; then
    bash web.sh
elif [ "$section" = "backend" ]; then
    sh django.sh
elif [ "$section" = "app" ]; then
    bash app.sh
elif [ "$section" = "desktop" ]; then
    bash desktop.sh
else
    echo "Invalid section. Please choose from web, backend, app, or desktop."
fi
