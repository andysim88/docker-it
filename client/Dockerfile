FROM node:slim AS base
WORKDIR /

RUN yes | sudo apt-get install git

RUN git clone https://github.com/mukunthan1502/docker-it.git

WORKDIR /docker-it/client

ENTRYPOINT [ "npm", "start" ]