#!/bin/bash
# These are the basic paths, mine also includes my own scripts path.
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/snap/bin

# Note: LANG allows grep regexes to work properly in called scripts.
export LANG=en_GB.UTF-8
#export DISPLAY=:0


OPERATOR=$1
TARGET_USER=$2
DATA="/home/$OPERATOR/.parental-controls/data/$TARGET_USER"
DT=$(date '+%Y-%m-%d %H:%M:%S')
DAY=$(date '+%Y/%m/%d')
TIME=$(date '+%H:%M:%S')
CURRENT_DIR="$DATA/$DAY"
echo "   OPERATOR : $DT "
echo "TARGET_USER : $DT "
echo "         DT : $DT "
echo "        DAY : $DAY "
echo "       TIME : $TIME "


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