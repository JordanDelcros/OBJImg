[![Join the chat at https://gitter.im/JordanDelcros/OBJImg](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/JordanDelcros/OBJImg?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/objimg.svg)](https://www.npmjs.com/package/objimg)

# OBJIMG - Command Line Interface
 
Install the npm package by typing this command in the terminal:
```bash
	$ npm install -g objimg
```

then use the `objimg` command to generate the PNG image from your model:

```bash
	# generate a png in the same directory with the same name finishing by *.png
	objimg path/to/model.obj 
	
	# generate a png in a special path with defined name
	objimg -o path/to/output.png path/to/model.obj
```

##### Options

 - **-o**: (--output) choose the output path and file name for the PNG
 - **-v**: (--verbose) enable the verbose mode, it will logs informations along generating

## How to use the generated image after that?

After having generated the PNG, you'll want to use it... No worries, all informations are on [the Github page of the main script](https://github.com/JordanDelcros/OBJImg)