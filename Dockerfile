FROM node:8
WORKDIR /etc/twitter-clone
COPY ./* ./
RUN npm install
ENTRYPOINT ["npm",  "start"]
