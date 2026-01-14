FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Use legacy-peer-deps like we did in terminal
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]