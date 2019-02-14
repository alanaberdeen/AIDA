const { promisify } = require('util')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const os = require('os')
const chalk = require('chalk')

// Check for images in the directory and update the images.json file
async function checkForImages () {
  const writeFile = promisify(fs.writeFile)
  const images = await findImages()
  var json = JSON.stringify(images)
  await writeFile('data/images.json', json, 'utf8')
}

async function findImages () {
  const dirPath = 'data/images'
  const images = []

  const readdir = promisify(fs.readdir)
  const stat = promisify(fs.stat)

  try {
    const files = await readdir(dirPath)
    for (const file of files) {
      const fileStats = await stat(dirPath + '/' + file)
      // Exclude hidden and directories
      if (file[0] !== '.' && !fileStats.isDirectory()) {
        images.push(file)
      }
    }
    return images
  } catch (err) {
    console.log(err)
  }
}

async function saveAnnotation (data) {
  const writeFile = promisify(fs.writeFile)
  const imageName = data.imageName
  const filePath = 'data/annotations/' + imageName + '.json'
  const json = JSON.stringify(data.annotationData)
  await writeFile(filePath, json, 'utf8')
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

  // Serve static files from the data directory
  app.use('/data', express.static('data'))

  // Serve the built application
  app.use(express.static('.'))

  const networkIPAddress = os.networkInterfaces().en0[1].address

  // Listen to requests
  app.listen(port, () => {
    console.log(`  AIDA running at:`)
    console.log('  - Local:   ' + chalk.cyan(`http://localhost:${port}/`))
    console.log('  - Network: ' + chalk.cyan(`http://` + networkIPAddress + `:${port}/`))
  })
}

startServer()
