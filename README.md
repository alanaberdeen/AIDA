# AIDA

## The Basic Idea

AIDA is an attempt to bring an open source web-based work-flow to image annotation. Currently, in the biomedical imaging space, image annotation is largely confined to single computer shrink-wrapped software with limited interactive capabilities and few, usually closed, data formats.

AIDA is a web interface that enables distributed teams of researchers to directly annotate images with easy to use on screen drawing tools. AIDA supports the creation of well defined annotation trials which include a series of high resolution images and a specific set of annotation tasks.

For documentation and further information see the [Wiki](https://github.com/alanaberdeen/AIDA/wiki).

## See a demo

Play with a live example [here](https://alanaberdeen.github.io/AIDA/#/demo)

## How has it been implemented?

The user interface is a [VueJS](https://vuejs.org/) Single Page Application, encapsulating and interacting with two other significant JavaScript libraries: [OpenSeaDragon](https://openseadragon.github.io/) to manipulate the high-res images and [PaperJS](http://paperjs.org/) to provide the drawing functionality. [VuetifyJS](http://vuetifyjs.com/) is used as a UI component library which implements the material design language.

AIDA reads and writes data in a simple JSON structure over a web API.

## What's planned?

The next stage of development will be to integrate intelligent tools that leverage the power of machine learning techniques. We hope to enhance the ability of the user to quickly and accurately mark up images through predictive assistance.

## License

The software is published as Open Source under the permissive [MIT license](https://github.com/alanaberdeen/AIDA/blob/master/LICENSE). The [API](https://aida.gitbook.io/docs/api-reference) is also be public.

## Run Locally

You can use AIDA on your local machine. The only requirement [NodeJS >v11](https://nodejs.org/en/).

An up to date and pre-built application is available on the gh-pages branch.

Alternatively, if you'd like to build AIDA youreself:

1. Clone the repository
2. Run the OS specific build script `npm run build:darwin:linux` or `npm run build:win32`
3. `cd` to `/dist`
4. Install dependencies via `npm install`
5. Add the images you want to annotate to the `/dist/data/images` directory.
6. Run the nodeJS local application via `node aidaLocal.js`
7. Navigate to the localhost webserver specified in the console
8. Annotations are read from and written to `/dist/data/annotations`

## Develop

Requirement [NodeJS](https://nodejs.org/en/).
Example work-flow:

1. Clone the repository
2. Install dependencies via `npm install`
3. For development: start a hot-reloading dev server with `npm run serve`
4. For deployment: bundle together with `npm run build`

## Support for tiled images, International Image Interoperability Framework (IIIF)

This removes the requirement for DZI file formats and replaces it with a web-server. At this point it is still a bit experimental.

- Deploy Cantaloupe IIIF server as described [here](https://cantaloupe-project.github.io/).
- Edit the Cantaloupe configuration file so that `FilesystemSource.BasicLookupStrategy.path_prefix` points to `/dist/data/images/`.
- Cataloupe server must be running at 'localhost:8182'
- Currently only TIFF files are supported.

## About

This application was built by [Alan Aberdeen](https://github.com/alanaberdeen) and [Stefano Malacrino](https://github.com/stefano-malacrino) with contributions from Nasullah Khalid Alham and [Ramón Casero](https://github.com/rcasero). It originated at the [Quantitative Biological Imaging Group](http://www.ludwig.ox.ac.uk/jens-rittscher-group-page), The University of Oxford.
