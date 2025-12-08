FROM node:20-alpine

WORKDIR /app

# Install dependencies needed for compilation
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose Hardhat node port
EXPOSE 8545

# Start script that compiles and runs node
CMD sh -c "npx hardhat compile && npx hardhat node"
