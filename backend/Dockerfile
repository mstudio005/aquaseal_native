# Start with a clean base image
FROM ubuntu:22.04

# Install Python 3, Node.js (latest stable version via NodeSource), and build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip curl wget git ca-certificates build-essential && \
    \
    # Install Node.js v20.x (or choose 18/22 as needed) from NodeSource
    curl -fsSL deb.nodesource.com | bash - && \
    apt-get install -y nodejs && \
    \
    # Clean up apt lists to keep image size small
    apt-get clean && rm -rf /var/lib/apt/lists/*

# FIX: Create a symbolic link so that 'python' points to 'python3'
RUN ln -s /usr/bin/python3 /usr/bin/python

# Create the application directory
WORKDIR /app

# Copy application code
COPY . /app

# Install Node.js dependencies (Python and the correct Node version are now available)
RUN npm ci

# Set the command to run your combined application (e.g., "npm start")
CMD ["npm", "start"]
