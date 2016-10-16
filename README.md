# President Clicker

## client

## server

Dev:

```npm install
set NODE_DEBUG=debug && set NODE_ENV=development && node --expose-gc index.js```

Deploy in prod (https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04):

Set ```process.env.NODE_ENV === "production"``` first.

```git clone
cd president-clicker/server
npm install
pm2 start index.js --node-args="--expose-gc"```
Later:
```git pull
(npm install)
pm2 restart index```


```watch tail -n20 ~/.pm2/logs/index-out-0.log ~/.pm2/logs/index-error-0.log```
