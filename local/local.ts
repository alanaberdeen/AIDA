import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
const fsp = fs.promises
import path from 'path'
import ip from 'ip'
import ini from 'ini'

// Read configuration file
const config = ini.parse(
	fs.readFileSync(path.join(__dirname, 'config.ini'), 'utf-8')
)

const dataDir = path.isAbsolute(config.data_dir)
	? config.data_dir
	: path.join(__dirname, config.data_dir)

// iiif configuration
const iiifHostname = config.IIIF.hostname.toString()
const iiifPort = parseInt(config.IIIF.port.toString(), 10)
const iiifHttps = config.IIIF.https.toString().toLowerCase() === 'true'

async function walk(dir: string, rootDir: string) {
	const fileList = []
	const files = await fsp.readdir(dir)
	for (const fileName of files) {
		const filePath = path.join(dir, fileName)
		const fileInfo = {
			name: fileName,
			path: path.relative(rootDir, filePath),
			children: [],
			type: 'file',
			ext: '',
		}
		try {
			const fileStat = await fsp.stat(filePath)
			if (fileStat.isDirectory()) {
				fileInfo.type = 'directory'
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

async function startServer() {
	const app = express()
	const port = 8000

	// Allow CORS
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*')
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept'
		)
		next()
	})

	// Need to parse POST Body data (for parsing application/json)
	// Increase the limit from the default (100kb) to enable large annotation JSON
	// files
	app.use(
		bodyParser.json({
			limit: '100mb',
		})
	)
	app.use(bodyParser.text())

	// Ping
	app.get('/ping', (req, res) => {
		res.send('pong')
	})

	// Save annotation data
	app.post('/save', async function (req, res) {
		const { annotationPath, annotationData } = req.body
		const absolutePath = path.join(dataDir, annotationPath)

		try {
			const json = JSON.stringify(annotationData)

			try {
				await fsp.writeFile(absolutePath, json, 'utf8')
			} catch (err) {
				// If the error was because the directory did not exist then make it first
				if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
					try {
						await fsp.mkdir(path.dirname(absolutePath), {
							recursive: true,
						})
						await fsp.writeFile(absolutePath, json, 'utf8')
					} catch (err) {
						console.log(err)
					}
				}
			}

			res.send('Success, annotation data saved')
		} catch (err) {
			console.log('Data could not be saved')
			console.log(err)
			res.send('Failed, annotation data could not be saved')
		}
	})

	// Walk specified path and return items
	// req.body.path should be the path to the directory to check.
	app.post('/getItemsAtPath', async function (req, res) {
		try {
			const pathToCheck = req.body.path
			const items = await walk(path.join(dataDir, pathToCheck), dataDir)
			res.send(items)
		} catch (err) {
			console.error('Could not get items at path')
			console.error(err)
			res.send('Failed, Could not get items at path')
		}
	})

	// Serve static  data
	// Always respond with headers that disable the cache. Specifically this is
	// important when editing raster images. Without this, when the editor is
	// reloaded the browser will serve the original, pre-edit, from the cache.
	app.use(
		'/data',
		express.static(dataDir, {
			setHeaders: function (res, path) {
				res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
			},
		})
	)

	app.get('/iiif', function (req, res) {
		const protocol = iiifHttps ? 'https' : 'http'
		res.send(
			new URL(
				'/iiif/2/',
				`${protocol}://${iiifHostname}:${iiifPort}`
			).toString()
		)
	})

	// Listen to requests
	app.listen(port, () => {
		console.log('AIDA running:')
	})
}

startServer()
