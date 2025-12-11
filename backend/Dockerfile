# Start with a base image that has essential tools
FROM ubuntu:22.04

# Install Python 3 and Node.js 22 using apt (system packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip nodejs npm curl wget git ca-certificates build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create the application directory
WORKDIR /app

# Copy application code
COPY . /app

# Install Node.js dependencies (Python should now be available in the PATH)
RUN npm ci

# Set the command to run your combined application
# (Update this line with your actual start command, e.g., "npm start")
CMD ["npm", "start"]
