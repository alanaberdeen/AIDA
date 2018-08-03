# AIDA

## The Basic Idea

AIDA is an attempt to bring an open source web-based work-flow to image annotation. Currently, in the biomedical imaging space, image annotation is largely confined to single computer shrink-wrapped software with limited interactive capabilities and few, usually closed, data formats.

AIDA is a web interface that enables distributed teams of researchers to directly annotate images with easy to use on screen drawing tools. AIDA supports the creation of well defined annotation trials which include a series of high resolution images and a specific set of annotation tasks.

The trial and annotation data can be accessed programmatically via a [documented API](https://aida.gitbook.io/docs/).

## See a demo

Play with a live example [here](http://localhost:8080/#/example/dzi)

## How has it been implemented?

The user interface is a [VueJS](https://vuejs.org/) Single Page Application, encapsulating and interacting with two other significant JavaScript libraries: [OpenSeaDragon](https://openseadragon.github.io/) to manipulate the high-res images and [PaperJS](http://paperjs.org/) to provide the drawing functionality. [VuetifyJS](http://vuetifyjs.com/) is used as a UI component library which implements the material design language.

AIDA reads and writes data in a simple JSON structure over a web API. Login and user accounts can enable specific configuration of the tool for different trials and tasks.

## What's planned?

The software is published as Open Source under the permissive [MIT license](https://github.com/alanaberdeen/AIDA/blob/master/LICENSE) and can be modified by anyone. The [API](https://aida.gitbook.io/docs/api-reference) will also be public.

The next stage of development will be to integrate intelligent tools that leverage the power of machine learning techniques. We hope to enhance the ability of the user to quickly and accurately mark up images through predictive assistance

## Get going

Requirement [Yarn](https://yarnpkg.com/en/)/[Npm](https://www.npmjs.com/) package managers and Node.js.
Yarn example work-flow:

1.  Clone the repository
2.  Install dependencies via `yarn`
3.  For development: start a hot-reloading dev server with `yarn serve`
4.  For deployment: bundle together with `yarn build`

## About

This interface was built by Alan Aberdeen. It is a project of Jens Rittscher, Nasullah Khalid Alham and Alan Aberdeen at the University of Oxford, specifically the [Quantitative Biological Imaging Group](http://www.ludwig.ox.ac.uk/jens-rittscher-group-page).
