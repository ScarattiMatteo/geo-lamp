#!/bin/bash

echo "$(date) - php_apache.entrypoint.sh"

docker-php-ext-install mysqli

docker-php-entrypoint

apache2-foreground
