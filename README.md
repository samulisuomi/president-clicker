# President Clicker

Click the faces! http://presidentclicker.com

## client

### Local development:

* `npm install`
* `npm run start-dev`

To test a built version, run `gulp` and `http-server dist -p 8080` (install globally or use http-server in `/node_modules/`).

### Deploy in prod

1. Make sure `president-clicker` and `president-clicker-dist` projects are cloned in the same folder.
2. `npm run build`
3. Commit and push in `president-clicker-dist`.

## server

### Local development:

#### Database:

1. Install Docker
2. Install local postgres
 * `docker run --name presidentclicker-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres`
3. Init database:
 * `docker exec -it presidentclicker-postgres bash` 
 * `psql -U postgres`
 * Paste in stuff from `database/database.sql` 

#### Run:

* `npm install`
* `npm run start-dev-unix` on Mac/Linux, `npm run start-dev-windows` on Windows

### Deploy in prod
    
1. Setup a server, e.g. https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04

2. Set ```process.env.NODE_ENV === "production"``` first.

* `git clone`
* `cd president-clicker/server`
* `npm install`
* `sh start_prod.sh`

Later:
* `git pull`
* `(npm install)`
* `sh start_prod.sh`

Check pm2 logs: `watch tail -n20 ~/.pm2/logs/index-out-0.log ~/.pm2/logs/index-error-0.log`

No fancy DevOpsidoodles, yet... ;)

---

### To Do

- [ ] Integrate this and `president-clicker-dist` repos
