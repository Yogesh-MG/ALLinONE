#!/bin/bash

echo "Starting to execute the Android commands"
cd app || exit

#npm run build
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install || { echo "npm install failed"; exit 1; }
    npm install axios
else
    echo "npm dependencies already installed."
fi

if [ ! -d "dist" ]; then
    echo "Building the application..."
    npm run build || { echo "npm run build failed"; exit 1; }
else
    echo "Application already built."
fi

if [ ! -d "./android" ]; then
    echo "Android folder not found, creating one"
    npx cap add android
fi
npx cap sync android

echo "Press Y to run"
read -r fed

USERNAME=$(whoami)
SDK_PATH="C:\\\\Users\\\\$USERNAME\\\\AppData\\\\Local\\\\Android\\\\Sdk"
LOCAL_PROPERTIES="./android/local.properties"

echo "sdk.dir=$SDK_PATH" > "$LOCAL_PROPERTIES"

echo "✅ local.properties updated"

# Fixed condition: must have spaces inside [ ]
if [ "$fed" != "y" ]; then
    echo "Sync is completed, check android/app/build/outputs/app-debug.apk"
    exit 0
fi

# Only runs if user pressed Y
npx cap run android
echo "new-app-debug.apk generated, check android/app/build/outputs/app-debug.apk to check APP version"
#rm -rf node_modules
#rm -rf dist