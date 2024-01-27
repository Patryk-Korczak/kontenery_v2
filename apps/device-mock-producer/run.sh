#!/bin/sh

trap 'echo "Caught SIGUSR1"' SIGUSR1

while true
do
  node $MAIN_JS
   sleep $SLEEP_TIME &
   wait $!
done
