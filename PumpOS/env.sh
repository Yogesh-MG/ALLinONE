#!/bin/bash
cd backend || exit
# -----------------------------
# Function to generate Django SECRET_KEY
# -----------------------------
generate_secret_key() {
    # 50-character random key
    python3 - <<END
import string, random
chars = string.ascii_letters + string.digits + string.punctuation
print(''.join(random.SystemRandom().choice(chars) for _ in range(50)))
END
}

echo "Creating .env file for Django..."

# Generate SECRET_KEY automatically
DJANGO_SECRET_KEY=$(generate_secret_key)
echo "Generated SECRET_KEY: $DJANGO_SECRET_KEY"

# Ask user for other inputs
read -p "DEBUG (True/False) [True]: " DEBUG
DEBUG=${DEBUG:-True}

read -p "ALLOWED_HOSTS (comma separated) [localhost,127.0.0.1]: " ALLOWED_HOSTS
ALLOWED_HOSTS=${ALLOWED_HOSTS:-localhost,127.0.0.1}

read -p "DB_NAME [medica]: " DB_NAME
DB_NAME=${DB_NAME:-medica}

read -p "DB_USER [yogesh]: " DB_USER
DB_USER=${DB_USER:-yogesh}

read -sp "DB_PASSWORD [helo@1234]: " DB_PASSWORD
echo
DB_PASSWORD=${DB_PASSWORD:-helo@1234}

read -p "DB_PORT [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "DB_HOST [db]: " DB_HOST
DB_HOST=${DB_HOST:-db}

read -p "TIME_ZONE [Asia/Kolkata]: " TIME_ZONE
TIME_ZONE=${TIME_ZONE:-Asia/Kolkata}

# Write to .env file
cat > .env <<EOL
DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY
DEBUG=$DEBUG
ALLOWED_HOSTS=$ALLOWED_HOSTS
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_PORT=$DB_PORT
DB_HOST=$DB_HOST
TIME_ZONE=$TIME_ZONE
EOL

echo ".env file created successfully!"
