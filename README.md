# AIDA

## The Basic Idea

AIDA is an attempt to bring an open source web-based work-flow to image annotation. Currently, in the biomedical imaging space, image annotation is largely confined to single computer shrink-wrapped software with limited interactive capabilities and few, usually closed, data formats.

AIDA is a web interface that enables distributed teams of researchers to directly annotate images with easy to use on screen drawing tools. AIDA supports the creation of well defined annotation trials which include a series of high resolution images and a specific set of annotation tasks.

For documentation and further information see the [Wiki](https://github.com/alanaberdeen/AIDA/wiki). 

## See a demo

Play with a live example [here](https://alanaberdeen.github.io/AIDA/#/example/dzi)

## How has it been implemented?

The user interface is a [VueJS](https://vuejs.org/) Single Page Application, encapsulating and interacting with two other significant JavaScript libraries: [OpenSeaDragon](https://openseadragon.github.io/) to manipulate the high-res images and [PaperJS](http://paperjs.org/) to provide the drawing functionality. [VuetifyJS](http://vuetifyjs.com/) is used as a UI component library which implements the material design language.

AIDA reads and writes data in a simple JSON structure over a web API. Login and user accounts can enable specific configuration of the tool for different trials and tasks.

## What's planned?

The software is published as Open Source under the permissive [MIT license](https://github.com/alanaberdeen/AIDA/blob/master/LICENSE). The [API](https://aida.gitbook.io/docs/api-reference) will also be public.

The next stage of development will be to integrate intelligent tools that leverage the power of machine learning techniques. We hope to enhance the ability of the user to quickly and accurately mark up images through predictive assistance

## Run Locally

You can use AIDA on your local machine. The only requirement [NodeJS >v11](https://nodejs.org/en/). 

A built and built version of the local application is included with the source code in the `/dist` directory. To begin using AIDA locally: 

1. Clone the repository 
2. `cd` to `/dist`
3. Install dependencies via `npm install`
4. Add the images you want to annotate to the `/dist/data/images` directory. 
5. Run the nodeJS local application via `node aidaLocal.js`
6. Navigate to the localhost webserver specified in the console 
7. Annotations are read from and written to `/dist/data/annotations`


## Develop

Requirement [NodeJS](https://nodejs.org/en/).
Example work-flow:

1.  Clone the repository
2.  Install dependencies via `npm install`
3.  For development: start a hot-reloading dev server with `npm run serve`
4.  For deployment: bundle together with `npm run build`

## About

This interface was built by Alan Aberdeen. It is a project of Jens Rittscher, Nasullah Khalid Alham and Alan Aberdeen at the University of Oxford, specifically the [Quantitative Biological Imaging Group](http://www.ludwig.ox.ac.uk/jens-rittscher-group-page).
