#!/bin/bash

echo "⏳ Waiting for Hardhat node to be ready..."
sleep 10

echo "🚀 Deploying smart contracts..."
cd /app
npx hardhat run scripts/deploy.js --network localhost

echo "✅ Deployment complete!"
echo "📋 Contract addresses saved to deployed-addresses.json"

# Keep container running
tail -f /dev/null
