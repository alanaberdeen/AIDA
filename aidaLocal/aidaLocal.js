const express = require('express')
const bodyParser = require('body-parser')
const fsp = require('fs').promises
const path = require('path')
const chalk = require('chalk')
const ip = require('ip')
const fs = require('fs')
const ini = require('ini')

// Check for images in the data/images/
// Write a file an array of the available images as reference.

const config = ini.parse(fs.readFileSync(path.join(__dirname, 'config.ini'), 'utf-8'))
const dataDir = path.isAbsolute(config.data_dir) ? config.data_dir : path.join(__dirname, config.data_dir)
const annotationsDir = path.isAbsolute(config.annotations_dir) ? config.annotations_dir : path.join(__dirname, config.annotations_dir)
const iiifHostname = config.IIIF.hostname.toString()
const iiifPort = parseInt(config.IIIF.port.toString(), 10)
const iiifHttps = (config.IIIF.https.toString().toLowerCase() === 'true')

async function walk (dir, rootDir) {
  const fileList = []
  const files = await fsp.readdir(dir)
  for (const fileName of files) { 
    const filePath = path.join(dir, fileName)
    const fileInfo = {
      name: fileName,
      path: path.relative(rootDir, filePath)
    }
    try {
      const fileStat = await fsp.stat(filePath)
      if (fileStat.isDirectory()) {
        fileInfo.children = []
      } else if (fileStat.isFile()) {
        fileInfo.ext = path.extname(fileName)
      }
      fileList.push(fileInfo)
    } catch (err) {
      console.log(err)
    }
  }
  return fileList
}

async function saveAnnotation (payload) {
  // Get the IP address of the current machine. If we need to write a new raster
  // file we should save the link to it using the IP address. This ensures the
  // API endpoint where the image can be found is referenced correctly even
  // when using AIDA over a network connection.
  const networkIPAddress = ip.address()

  // Check for raster image items and if found we need to save these as image
  // files and replace the item.source with link to that file.
  payload.annotation.data.layers.forEach(layer => {
    layer.items.forEach((item, index) => {
      if (item.type === 'raster' && item.source.substring(0, 4) === 'data') {
        const imagePath = path.join(annotationsDir, 'raster', index + '_' + layer.name + '.png')
        saveRaster(item.source, imagePath)

        // Edit the source link to correctly reference the API endpoint where
        // the image is available.
        const apiEndpoint = 'annotations/raster/' + index + '_' + layer.name + '.png'
        item.source = 'http://' + networkIPAddress + ':3000/' + apiEndpoint
      }
    })
  })

  // Write annotation data as JSON file.
  let annotationFilePath = payload.annotation.filePath ? payload.annotation.filePath : `${payload.images[0].name}.json`
  annotationFilePath = `${annotationsDir}/${annotationFilePath}`
  const json = JSON.stringify(payload.annotation.data)

  try {
    await fsp.writeFile(annotationFilePath, json, 'utf8')
  } catch (err) {
    // If the error was because the directory did no extist then make it first
    if (err.code === 'ENOENT') {
      try {
        await fsp.mkdir(path.dirname(annotationFilePath), { recursive: true })
        await fsp.writeFile(annotationFilePath, json, 'utf8')
      } catch (err) {
        console.log(err)
      }
    }
  }
}

function saveRaster (dataURL, path) {
  const base64Data = dataURL.replace(/^data:image\/(png|gif|jpeg);base64,/, '')
  fsp.writeFileSync(path, base64Data, 'base64')
}

async function startServer () {
  const app = express()
  const port = 3000

  // Allow CORS
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  // Need to parse POST Body data (for parsing application/json)
  // Increase the limit from the default (100kb) to enable large annotation JSON
  // files
  app.use(bodyParser.json({
    limit: '100mb'
  }))
  app.use(bodyParser.text())

  // Save annoation data
  app.post('/save', async function (req, res) {
    try {
      await saveAnnotation(req.body)
      res.send('Success, annotation data saved')
    } catch (err) {
      console.log('Data could not be saved')
      console.log(err)
      res.send('Failed, annotation data could not be saved')
    }
  })

  // Check for images that may have been added to the directory
  app.post('/checkForImagesAndProjects', async function (req, res) {
    try {
      const childDir = req.body
      const items = await walk(path.join(dataDir, childDir), dataDir)
      res.send(items)
    } catch (err) {
      console.log('Could not check for images')
      console.log(err)
      res.send('Failed, could not find images')
    }
  })

  // Serve static  data
  // Always respond with headers that disable the cache. Specifically this is
  // important when editing raster images. Without this, when the editor is
  // reloaded the browser will serve the original, pre-edit, from the cache.
  app.use('/data', express.static(dataDir, {
    setHeaders: function (res, path) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    }
  }))

  app.get('/iiif', function (req, res) {
    protocol = iiifHttps ? 'https' : 'http'
    res.send(new URL('/iiif/2/', protocol + '://' + iiifHostname + ':' + iiifPort).toString())
  })

  // Serve the built application
  app.use(express.static(__dirname))

  app.route('/*')
    .get(function (req, res) {
      res.sendFile(path.join(__dirname, 'index.html'))
    })

  // Get the IP address of the current machine. The application will also be
  // usable over the network from this address.
  const networkIPAddress = ip.address()

  // Listen to requests
  app.listen(port, () => {
    console.log('  AIDA running at:')
    console.log('  - Local:   ' + chalk.cyan(`http://localhost:${port}/dashboard`))
    console.log('  - Network: ' + chalk.cyan('http://' + networkIPAddress + `:${port}/dashboard`))
  })
}

startServer()
