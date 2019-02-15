const { promisify } = require('util')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const os = require('os')
const chalk = require('chalk')

// Check for images in the data/images/
// Write a file an array of the available images as reference.
async function checkForImages () {
  const writeFile = promisify(fs.writeFile)
  const images = await findImages('data/images')
  var json = JSON.stringify(images)
  await writeFile('data/images.json', json, 'utf8')
}

// Returns an array of avialable images in the specified directory.
async function findImages (dirPath) {
  const readdir = promisify(fs.readdir)
  const stat = promisify(fs.stat)

  try {
    // Get an array of **all items** at the path.
    const items = await readdir(dirPath)

    // Exclude hidden files and directories
    return items.filter(async (item) => {
      const fileStats = await stat(dirPath + '/' + item)
      return item[0] !== '.' && !fileStats.isDirectory()
    })
  } catch (err) {
    console.log(err)
  }
}

async function saveAnnotation (data) {
  const writeFile = promisify(fs.writeFile)

  // Get the IP address of the current machine. If we need to write a new raster
  // file we should save the link to it using the IP address. This ensures the
  // API endpoint where the image can be found is referenced correctly even
  // when using AIDA over a network connection.
  const networkIPAddress = os.networkInterfaces().en0[1].address

  // Check for raster image items and if found we need to save these as image
  // files and replace the item.source with link to that file.
  data.annotationData.layers.forEach(layer => {
    layer.items.forEach(item => {
      if (item.type === 'raster' && item.source.substring(0, 4) === 'data') {
        //
        // Extract the base64 data
        const base64Data = item.source.replace(/^data:image\/(png|gif|jpeg);base64,/, '')

        // Save to sub-directory for raster annotation items
        const imagePath = 'data/annotations/raster/' + data.imageName + '_' + layer.name + '.png'
        fs.writeFileSync(imagePath, base64Data, 'base64')

        // Edit the source link to correctly reference the API endpoint where
        // the image is available.
        const apiEndpoint = 'annotations/raster/' + data.imageName + '_' + layer.name + '.png'
        item.source = 'http://' + networkIPAddress + ':3000/' + apiEndpoint
      }
    })
  })

  // Write annotation data as JSON file.
  const imageName = data.imageName
  const annotationFilePath = 'data/annotations/' + imageName + '.json'
  const json = JSON.stringify(data.annotationData)
  await writeFile(annotationFilePath, json, 'utf8')
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
  app.post('/checkForImages', async function (req, res) {
    try {
      await checkForImages()
      res.send('Success, found images')
    } catch (err) {
      console.log('Could not check for images')
      console.log(err)
      res.send('Failed, could not find images')
    }
  })

  // Serve image files
  app.use('/images', express.static('data/images', {}))

  // Serve static annotation data
  // Always respond with headers that disable the cache. Specifically this is
  // important when editing raster images. Without this, when the editor is
  // reloaded the browser will serve the original, pre-edit, from the cache.
  app.use('/annotations', express.static('data/annotations', {
    setHeaders: function (res, path) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    }
  }))

  // Serve the built application
  app.use(express.static('.'))

  // Get the IP address of the current machine. The application will also be
  // usable over the network from this address.
  const networkIPAddress = os.networkInterfaces().en0[1].address

  // Listen to requests
  app.listen(port, () => {
    console.log(`  AIDA running at:`)
    console.log('  - Local:   ' + chalk.cyan(`http://localhost:${port}/`))
    console.log('  - Network: ' + chalk.cyan(`http://` + networkIPAddress + `:${port}/`))
  })
}

startServer()
