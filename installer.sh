#!/usr/bin/env bash

set -euo pipefail

if [[ $(id -u) -ne 0 ]]; then
	echo "This script must be run as root or with sudo."
	exit 1
fi

if [[ $(uname -s) != "Linux" ]]; then
	echo "This installer currently supports Linux only."
	exit 1
fi

if command -v apt-get >/dev/null; then
	apt-get update
	apt-get install -y ca-certificates curl git
elif command -v dnf >/dev/null; then
	dnf install -y ca-certificates curl git
elif command -v yum >/dev/null; then
	yum install -y ca-certificates curl git
else
	echo "Unsupported package manager."
	exit 1
fi

if ! command -v docker >/dev/null || ! docker compose version >/dev/null 2>&1; then
	install_script=$(mktemp)
	curl --fail --silent --show-error --location https://get.docker.com --output "$install_script"
	sh "$install_script"
	rm -f "$install_script"
fi

if ! docker compose version >/dev/null 2>&1; then
	echo "Docker Compose v2 is required but could not be installed."
	exit 1
fi

git clone https://github.com/askrella/whatsapp-chatgpt.git
cd whatsapp-chatgpt

read -r -s -p "Enter your OpenAI API key: " api_key
printf "\n"
printf "OPENAI_API_KEY=%s\n" "$api_key" >.env
chmod 600 .env

docker compose up --detach
echo "WhatsApp ChatGPT started. Run 'docker compose logs --follow' to scan the QR code."
