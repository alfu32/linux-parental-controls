Usage: sensors [OPTION]... [CHIP]...
  -c, --config-file     Specify a config file
  -h, --help            Display this help text
  -s, --set             Execute `set' statements (root only)
  -f, --fahrenheit      Show temperatures in degrees fahrenheit
  -A, --no-adapter      Do not show adapter for each chip
      --bus-list        Generate bus statements for sensors.conf
  -u                    Raw output
  -j                    Json output
  -v, --version         Display the program version

Use `-' after `-c' to read the config file from stdin.
If no chips are specified, all chip info will be printed.
Example chip names:
	lm78-i2c-0-2d	*-i2c-0-2d
	lm78-i2c-0-*	*-i2c-0-*
	lm78-i2c-*-2d	*-i2c-*-2d
	lm78-i2c-*-*	*-i2c-*-*
	lm78-isa-0290	*-isa-0290
	lm78-isa-*	*-isa-*
	lm78-*
