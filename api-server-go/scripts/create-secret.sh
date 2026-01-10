#!/bin/bash

# Create Kubernetes secret for SMTP credentials
# Usage: ./scripts/create-secret.sh

set -e

echo "Creating Kubernetes secret for Formalogix API..."

# Prompt for credentials
read -p "Enter EMAIL_USER (default: info@formalogix.com): " EMAIL_USER
EMAIL_USER=${EMAIL_USER:-info@formalogix.com}

read -sp "Enter EMAIL_PASS (SMTP password): " EMAIL_PASS
echo

read -p "Enter EMAIL_TO (default: info@formalogix.com): " EMAIL_TO
EMAIL_TO=${EMAIL_TO:-info@formalogix.com}

# Validate inputs
if [ -z "$EMAIL_PASS" ]; then
  echo "Error: EMAIL_PASS is required"
  exit 1
fi

# Create secret
kubectl create secret generic formalogix-api-secret \
  --namespace=formalogix \
  --from-literal=EMAIL_USER="$EMAIL_USER" \
  --from-literal=EMAIL_PASS="$EMAIL_PASS" \
  --from-literal=EMAIL_TO="$EMAIL_TO" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "✅ Secret created successfully!"
echo ""
echo "Verify with:"
echo "  kubectl -n formalogix get secret formalogix-api-secret"
