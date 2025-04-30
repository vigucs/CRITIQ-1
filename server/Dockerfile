FROM node:16-alpine

WORKDIR /app

# Install TypeScript and Jest globally
RUN npm install -g typescript jest

COPY package*.json ./
RUN npm install

COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"] 