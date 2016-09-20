#!/bin/bash

sudo java -Djava.library.path=/bin/dynamodb/DynamoDBLocal_lib -jar /bin/dynamodb/DynamoDBLocal.jar -sharedDb -port 8000 &> /var/log/dynamodb