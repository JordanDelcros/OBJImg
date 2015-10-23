# OBJIMG
Convert an OBJ/MTL files (exported from a 3D soft) into a lightweight image ready for THREE JS.

## Wait! what?
Ok, an OBJ file contains all informations about the 3D model: vertices, faces, normals, and UVs, groups and materials...
All these informations are translated into colours and stored into one single image.

## Why?
First of all, for the fun!

Then cause it save disk space (the compression method can save up to 80% on the file size) and it reduce the files to load from 2 (OBJ and MTL) to only 1 (except textures).

![sample schema](resources/schema.jpg)
