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
docker compose up -d