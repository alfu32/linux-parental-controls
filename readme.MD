# Linux Parental Controls
_work in progress_
## Objective
    - provide a backend that allows the OPERATOR_USER to limit the ability of the TARGET_USER to execute applications
    for more time than the alloted value or outside the permitted hours
    - provide a statistic of application usage
    
This scenario is similar with Family link from the configuration points. 


**similar projects**:
 - timekeepr-next (downside that it doesn't seem to be configurable remotely)


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
 compile nodejs scripts:
 ```bash
 npm install
 npx tsc
 ```

 run aggregator (aggregates the ps log data):
 ```bash
 npm run test:aggregate
 ```

 apply rules (generates a operation list based on the previous step):
 ```bash
 npm run test:apply-rules
 ```

### Installation scenarios
#### Target Machine only
#### Dual Target and Operator machines