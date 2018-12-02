FROM node:8.14.0-alpine

# ENV NODE_ENV=development
RUN mkdir /app
WORKDIR /app
COPY package.json /app/
RUN npm install

COPY . /app/

EXPOSE 7000
CMD ["npm", "start"]
