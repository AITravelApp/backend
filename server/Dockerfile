FROM node:20

WORKDIR /app/server

COPY package*.json ./

# Install PostgreSQL client and other dependencies
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

RUN npm install --force


COPY . .

EXPOSE 4000

CMD ["npm", "start"]