FROM node

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g bower

RUN cd client && bower install  --allow-root

RUN cd server && npm install

# replace this with your application's default port
EXPOSE 8888

# replace this with your main "server" script file
CMD cd server && node server.js