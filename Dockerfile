FROM node:21.5.0

WORKDIR /app

COPY . /app/
RUN npm install --silent 

CMD ["npm", "run", "dev-docker"]
