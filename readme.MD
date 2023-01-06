# Linux Parental Controls
## Requirements
    - ssh
    - nodejs
    - cron

## Installation
 First install ssh. Then configure the target user crontab through ssh on the target machine.
 the script `watch.sh` will start pumping ps data into the data folder `/home/<TARGET_USERNAME>/.parental-controls/data`
 ```crontab
    MAILTO=<YOUR.EMAIL@ADDRESS>
* * * * * /home/<OPERATOR_USERNAME>/.parental-controls/./watch.sh <OPERATOR_USERNAME> <TARGET_USERNAME> \
    0>/home/<OPERATOR_USERNAME>/.parental-controls/log \
    &1>/home/<OPERATOR_USERNAME>/.parental-controls/log2 \
    &2>/home/<OPERATOR_USERNAME>/.parental-controls/err
 ```
### Installation scenarios
#### Target Machine only
#### Dual Target and Operator machines