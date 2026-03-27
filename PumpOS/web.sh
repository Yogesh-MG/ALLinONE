#!/bin/bash

# This is to start the front-end application
echo -e "\033[0;36mStarting front-end application...\033[0m"


# To move to the directory where the front-end code is located
cd frontend || exit 1
# To install dependencies and build the application
if [ ! -d "node_modules" ]; then
    echo -e "\033[0;33mInstalling npm dependencies...\033[0m"
    npm install || { echo -e "\033[0;31mnpm install failed\033[0m"; exit 1; }
    echo -e "\033[0;32mnpm dependencies installed successfully.\033[0m"
else
    echo -e "\033[0;32mnpm dependencies already installed.\033[0m"
fi



read -rp "Do you want to build the application in Production({p - using new dist} - {po - using old dist}) else in dev (d)?: " build_choice
if [ "$build_choice" = "p" ]; then
    echo -e "\033[0;33mBuilding the application...\033[0m"
    npm run build || { echo -e "\033[0;31mnpm run build failed\033[0m"; exit 1; }
    npm run preview
    echo -e "\033[0;32mApplication built successfully.\033[0m"
elif [ "$build_choice" = "d" ]; then
    echo -e "\033[0;33mRunning the application in Developer mode.\033[0m"
    npm run dev || { echo -e "\033[0;31mnpm run dev failed\033[0m"; exit 1; }
elif [ "$build_choice" = "po" ]; then
    echo -e "\033[0;33mRunning the application in Production mode.\033[0m"
    npm run preview || { echo -e "\033[0;31mnpm run dev failed\033[0m"; exit 1; }
else
    echo -e "\033[0;31mInvalid choice. Please enter P for Production or D for Developer.\033[0m"
    exit 1
fi

# To start the application in preview mode
npm run preview