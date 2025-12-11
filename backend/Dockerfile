# Start with a base image that has essential tools
FROM ubuntu:22.04

# Install Python 3, Node.js, and build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip nodejs npm curl wget git ca-certificates build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# **FIX:** Create a symbolic link so that 'python' points to 'python3'
RUN ln -s /usr/bin/python3 /usr/bin/python

# Create the application directory
WORKDIR /app

# Copy application code
COPY . /app

# Install Node.js dependencies (Python should now be available in the PATH via the alias)
RUN npm ci

# Set the command to run your combined application
# Update this line with your actual start command, e.g., "npm start"
CMD ["npm", "start"]
