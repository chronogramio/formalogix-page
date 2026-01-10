#!/bin/bash

# Simple script to run the API server locally
# Reads .env file and starts the server

set -a
source .env
set +a

# Build and run
go run cmd/api/main.go
