## Docker
Linux shell:
```
docker run \
    --name mongo1 \
	-e MONGO_INITDB_ROOT_USERNAME=root \
	-e MONGO_INITDB_ROOT_PASSWORD=example \
    -p 27019:27017 \
    -v './scripts1:/docker-entrypoint-initdb.d/' \
    -d mongo:8
```

CMD Dos:
```
docker run --name mongo1 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example -p 27019:27017 -v scripts1:/docker-entrypoint-initdb.d/ -d mongo:8
```

## Docker compose
- start composition:
```
docker compose up -d
```

- start a shell inside mongo container:
```
docker compose exec -it mongo bash
docker compose exec -it mongo mongosh
docker compose exec -it mongo mongosh -u root -p
docker compose exec -it mongo mongosh -u root -p example

```

## Mongo CLI: mongosh

mongosh                     (instance, base test, no auth)
mongosh -u root -p          (user + password interactif)  
mongosh -u root -p example  (user + password)

### commands in mongosh
show dbs
show databases

use mydb
show collections
