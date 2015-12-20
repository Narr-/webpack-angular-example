FROM ubuntu

# Install curl
RUN apt-get -y install curl

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

# Copy app sources
COPY ./dist /webpack-angular-example/dist
COPY ./server /webpack-angular-example/server
COPY ./package.json /webpack-angular-example

# Install app dependencies
RUN cd /webpack-angular-example; npm install --production

# CMD ["executable","param1","param2"]
CMD ["node", "/webpack-angular-example/server/server.js"]
