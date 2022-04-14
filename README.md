# AIDA

## See a demo

Play with a live example [here](https://aida-demo.vercel.app/demo)

## The Basic Idea

AIDA is an attempt to bring an open source web-based work-flow to image annotation. Currently, in the biomedical imaging space, image annotation is largely confined to single computer shrink-wrapped software with limited interactive capabilities and few, usually closed, data formats.

AIDA is a web interface that enables distributed teams of researchers to directly annotate images with easy to use on screen drawing tools. AIDA supports the creation of well defined annotation trials which include a series of high resolution images and a specific set of annotation tasks.

For documentation and further information see the [Wiki](https://github.com/alanaberdeen/AIDA/wiki).

## How has it been implemented?

The user interface is a React [NextJS](https://nextjs.org/) Single Page Application, encapsulating and interacting with [OpenLayers](https://openlayers.org/) to provide the images and drawing functionality. [Tailwind](https://tailwindcss.com/) is the css framework.

AIDA reads and writes data in a simple JSON structure over a web API.

## What's planned?

The next stage of development will be to integrate intelligent tools that leverage the power of machine learning techniques. We hope to enhance the ability of the user to quickly and accurately mark up images through predictive assistance.

## License

The software is published as Open Source under the permissive [MIT license](https://github.com/alanaberdeen/AIDA/blob/master/LICENSE).

## Run Locally

You can use AIDA on your local machine. The only requirement [NodeJS](https://nodejs.org/en/).

1. Clone the repository
2. Install the dependencies via [NPM](https://www.npmjs.com/) `npm install`
3. Run the build script `npm run build`
4. Add the images you want to annotate to the `/local/data/` directory.
5. Run the local server application via `npm run start`
6. Navigate to the localhost webserver specified in the console
7. Annotations are read from and written to `/local/data/`

## Example local sever data directory

```
local
|  local.ts
|  tsconfig.json
|  ...
|
|  └──data
|    | README.md
|    | project.json           // AIDA project file (see below for example content)
|    | annotation.json
|
|    └──image-dz              // DeepZoom format 2D image
|    |   |  image.dzi
|    |
|    |   └──image_files
|    |   |
|    |   |   └──0
|    |   |      |  0_0.jpeg
|    |   |      |  0_1.jpeg
|    |   |      |  ...
|    |   |
|    |   |   └───1
|    |   |      |  0_0.jpeg
|    |   |      |  0_1.jpeg
|    |   |      |  ...
|    |   |
|    |   |   └───...
```

project.json defines the combination of image and annotation data.

```
{
  "image": "image-dz/image.dzi",
  "annotation": "annotation.json"
}
```

## Develop

Requirement [NodeJS](https://nodejs.org/en/).
Example work-flow:

1. Clone the repository
2. Install dependencies via `npm install`
3. For development: start a hot-reloading dev server with `npm run start`
4. For deployment: bundle together with `npm run build`

## Support for tiled images, International Image Interoperability Framework (IIIF)

This removes the requirement for DZI file formats and replaces it with a web-server. At this point it is still a bit experimental.

- Deploy Cantaloupe IIIF server as described [here](https://cantaloupe-project.github.io/).
- Edit the Cantaloupe configuration file so that `FilesystemSource.BasicLookupStrategy.path_prefix` points to `/local/data`.
- Cataloupe server must be running at 'localhost:8182'
- Currently only TIFF files are supported.

## About

This application was built by [Alan Aberdeen](https://github.com/alanaberdeen) and [Stefano Malacrino](https://github.com/stefano-malacrino) with contributions from Nasullah Khalid Alham and [Ramón Casero](https://github.com/rcasero). It originated at the [Quantitative Biological Imaging Group](http://www.ludwig.ox.ac.uk/jens-rittscher-group-page), The University of Oxford.
