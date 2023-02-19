#!/bin/bash

# Check if user has root/sudo access
if [[ $(id -u) -ne 0 ]]; then
  echo "This script must be run as root or with sudo."
  exit 1
fi

# Check user's operating system
os=$(uname -s)
case $os in
  Linux)
    # Install required packages using package manager
    if command -v apt-get &> /dev/null; then
      echo "Installing packages using apt-get..."
      apt-get update
      apt-get install -y git docker.io docker-compose
      echo "Packages installed successfully."
    elif command -v yum &> /dev/null; then
      echo "Installing packages using yum..."
      yum update
      yum install -y git docker docker-compose
      echo "Packages installed successfully."
    else
      echo "Unsupported package manager."
      exit 1
    fi
    ;;
  *)
    echo "Unsupported operating system."
    exit 1
    ;;
esac

# Clone Git repo and run Docker Compose
echo "Cloning Git repo..."
git clone https://github.com/askrella/whatsapp-chatgpt.git
cd repo

# Prompt user for API key
read -p "Enter your OpenAI API key: " api_key

# Replace API key variable in Docker Compose file
sed -i "s/OPENAI_API_KEY:.*/OPENAI_API_KEY: \"$api_key\"/g" docker-compose.yml

# Start Docker Compose
echo "Starting Docker containers..."
docker-compose up -d
echo "Docker containers started successfully."
