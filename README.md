# President Clicker

## client

## server

Dev:

```npm install
set NODE_DEBUG=debug && set NODE_ENV=development && node index.js```

Deploy in prod (https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04):

```git clone
cd president-clicker/server
npm install
pm2 start index.js```
Later:
```git pull
(npm install)
pm2 restart index```