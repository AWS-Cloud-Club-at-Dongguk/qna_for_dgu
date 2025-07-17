#!/bin/bash

set -e

ENDPOINT="http://localhost:8000"
REGION="ap-northeast-2"

# Delete existing tables if they exist
aws dynamodb delete-table \
  --table-name Rooms \
  --endpoint-url $ENDPOINT \
  --region $REGION || true

aws dynamodb delete-table \
  --table-name Connections \
  --endpoint-url $ENDPOINT \
  --region $REGION || true

aws dynamodb delete-table \
  --table-name Messages \
  --endpoint-url $ENDPOINT \
  --region $REGION || true

# Create new tables
aws dynamodb create-table \
  --table-name Rooms \
  --attribute-definitions AttributeName=roomId,AttributeType=S \
  --key-schema AttributeName=roomId,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url $ENDPOINT \
  --region $REGION

aws dynamodb create-table \
  --table-name Connections \
  --attribute-definitions AttributeName=connectionId,AttributeType=S \
  --key-schema AttributeName=connectionId,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url $ENDPOINT \
  --region $REGION

aws dynamodb create-table \
  --table-name Messages \
  --attribute-definitions AttributeName=roomId,AttributeType=S \
  --key-schema AttributeName=roomId,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url $ENDPOINT \
  --region $REGION
