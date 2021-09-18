docker-compose down
rm -rf ./data/postgres/* ./data/ipfs/*
docker-compose up --force-recreate
