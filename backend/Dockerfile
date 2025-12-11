# Use a combined, optimized image that already has Node and Python
FROM heroku/heroku:22-build

# Set the working directory
WORKDIR /app

# Copy application code
COPY . /app

# The base image already has Python and Node installed.
# We force a symbolic link 'python' to point to 'python3' for the npm package check.
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Install Node.js dependencies
RUN npm ci

# Define the command to run your application (update with your actual start command)
CMD ["npm", "start"]
