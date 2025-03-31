FROM node:20 AS dev
LABEL authors="gabriel.santos"

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm cache clean --force
RUN npm install

# Copy application files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]