FROM node

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g bower

RUN cd client
RUN bower install --allow-root
RUN cd ..


RUN cd server
# install your application's dependencies
RUN npm install

# replace this with your application's default port
EXPOSE 8888

# replace this with your main "server" script file
CMD [ "node", "server.js" ]