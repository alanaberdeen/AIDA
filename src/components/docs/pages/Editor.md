## Editor

#### Configuration
The configuration of the AIDA editor is stored in a plain javascript object.
This object is read when loading an editing instance. It fully specifies the
layout, image channels and annotation state.

The configuration object has the following parameters:


| Parameter         | Description                                              |
| :---------------- |:-------------------------------------------------------- |
| activeStep        | The currently active annotation step                     |
| steps             | The series of steps that describe the annotation task    |
| tools             | The tools available in the editor                        |
| channels          | The image channels in the viewer                         |
| annotation        | The current annotation state                             |

#### Tools

#### Layers
