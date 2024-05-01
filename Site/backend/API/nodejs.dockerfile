FROM node:20

RUN npm install -g nodemon
RUN npm install -g mysql2
RUN npm install -g jsonwebtoken
WORKDIR /home/node/app
COPY app/package.json .


COPY app/ ./ 
RUN npm install
EXPOSE 8080
CMD ["nodemon", "app.mjs","mysql2","jsonwebtoken"]
