#!/usr/bin/bash

docker exec -it banana-choco_db_1 psql --username hello_flask --dbname hello_flask_dev;