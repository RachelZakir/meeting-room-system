FROM node:18

WORKDIR /app

# Copy package.json first and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema before generating
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
