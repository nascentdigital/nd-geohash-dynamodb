#!/bin/bash

pid=`ps aux | grep DynamoDBLocal | awk '{print $2}'`
kill -9 $pid