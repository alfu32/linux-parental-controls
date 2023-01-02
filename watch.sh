#!/bin/bash
OPERATOR=$1
TARGET_USER=$2
DATA="/home/$OPERATOR/.parental-controls/data/$TARGET_USER"
DT=$(date '+%Y-%m-%d %H:%M:%S')
DAY=$(date '+%Y/%m/%d')
TIME=$(date '+%H:%M:%S')
CURRENT_DIR="$DATA/$DAY"
echo $DT
echo $DAY
echo $TIME

if [ ! -d $CURRENT_DIR ]
then
    echo "no data dir"
    mkdir -p $CURRENT_DIR
    chown $OPERATOR:$OPERATOR $CURRENT_DIR
else
    echo "yes data dir"
fi

env                          > $CURRENT_DIR/$TIME.env.txt
sensors -j                   > $CURRENT_DIR/$TIME.sensors.json
ps -aux | grep $TARGET_USER  > $CURRENT_DIR/$TIME.psaux.txt
wmctrl -d                    > $CURRENT_DIR/$TIME.wmctrl.desktops.txt
wmctrl -lp                   > $CURRENT_DIR/$TIME.wmctrl.windows.txt
chown $OPERATOR:$OPERATOR $CURRENT_DIR/$TIME.*