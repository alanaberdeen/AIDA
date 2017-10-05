# AIDA

### The Basic Idea                    
AIDA is an attempt to bring an open source web-based
workflow to image annotation. Currently, in the
biomedical imaging space, image annotation is largely
confined to single computer shrink-wrapped software with
limited interactive capabilities and few, usually
closed, data formats.
                       
AIDA is a web interface that enables distributed teams
of researchers to direclty annotate images with easy
to use on screen drawing tools. AIDA supports the
creation of well defined annotatio trials which include
a series of high resolution images or video and a
specific set of annotation tasks.
                    
The trial and annotation data can be accessed
programatically via a [documented API](https://alanaberdeen.github.io/AIDA/#/docs/api). 


### How has it been implemented?
The user interface is a [VueJS](https://vuejs.org/) Single Page Application
built to web standards, encapsulating and interacting with two other significant JavaScript libraries: [OpenSeaDragon](https://openseadragon.github.io/) 
to manipulate the high-res images and [PaperJS](http://paperjs.org/)to
provide the drawing functionality. This interface generates a JSON file that is written
to a database via a web API. Login enables specific
configuration of the tool for different trials
and tasks.

### What's planned?
The software is published as Open Source under the permissive [MIT license](https://github.com/alanaberdeen/AIDA/blob/master/LICENSE) and can be modified by anyone.
The [ API](https://alanaberdeen.github.io/AIDA/#/docs/api) will also be public.

The next stage of development will be to integrate
intelligent tools that leverage the power of machine
learning techniques. We hope to enhance the ability
of the user to quickly and accuratley mark up images
with using predicitive technqiues.


### About
This is a project by Jens Rittscher, Nasullah Khalid
Alham and Alan Aberdeen at the University of Oxford,
specifically the [Quantitative Biological Imaging Group](http://www.ludwig.ox.ac.uk/jens-rittscher-group-page). The project was funded by...
