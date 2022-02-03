"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const fsp = fs_1.default.promises;
const path_1 = __importDefault(require("path"));
const ip_1 = __importDefault(require("ip"));
const ini_1 = __importDefault(require("ini"));
// Check for images in the data/images/
// Write a file an array of the available images as reference.
// get current directory absolute path
// Read configuration file
const config = ini_1.default.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'config.ini'), 'utf-8'));
const dataDir = path_1.default.isAbsolute(config.data_dir)
    ? config.data_dir
    : path_1.default.join(__dirname, config.data_dir);
const annotationsDir = path_1.default.isAbsolute(config.annotations_dir)
    ? config.annotations_dir
    : path_1.default.join(__dirname, config.annotations_dir);
// iiif configuration
const iiifHostname = config.IIIF.hostname.toString();
const iiifPort = parseInt(config.IIIF.port.toString(), 10);
const iiifHttps = config.IIIF.https.toString().toLowerCase() === 'true';
function walk(dir, rootDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileList = [];
        const files = yield fsp.readdir(dir);
        for (const fileName of files) {
            const filePath = path_1.default.join(dir, fileName);
            const fileInfo = {
                name: fileName,
                path: path_1.default.relative(rootDir, filePath),
                children: [],
                type: 'file',
                ext: '',
            };
            try {
                const fileStat = yield fsp.stat(filePath);
                if (fileStat.isDirectory()) {
                    fileInfo.type = 'directory';
                }
                else if (fileStat.isFile()) {
                    fileInfo.ext = path_1.default.extname(fileName);
                }
                fileList.push(fileInfo);
            }
            catch (err) {
                console.log(err);
            }
        }
        return fileList;
    });
}
function saveAnnotation(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the IP address of the current machine. If we need to write a new raster
        // file we should save the link to it using the IP address. This ensures the
        // API endpoint where the image can be found is referenced correctly even
        // when using AIDA over a network connection.
        const networkIPAddress = ip_1.default.address();
        // Check for raster image items and if found we need to save these as image
        // files and replace the item.source with link to that file.
        payload.annotation.data.layers.forEach((layer) => {
            layer.items.forEach((item, index) => {
                if (item.type === 'raster' && item.source.substring(0, 4) === 'data') {
                    const imagePath = path_1.default.join(annotationsDir, 'raster', index + '_' + layer.name + '.png');
                    saveRaster(item.source, imagePath);
                    // Edit the source link to correctly reference the API endpoint where
                    // the image is available.
                    const apiEndpoint = 'annotations/raster/' + index + '_' + layer.name + '.png';
                    item.source = 'http://' + networkIPAddress + ':3000/' + apiEndpoint;
                }
            });
        });
        // Write annotation data as JSON file.
        let annotationFilePath = payload.annotation.filePath
            ? payload.annotation.filePath
            : `${payload.images[0].name}.json`;
        annotationFilePath = `${annotationsDir}/${annotationFilePath}`;
        const json = JSON.stringify(payload.annotation.data);
        try {
            yield fsp.writeFile(annotationFilePath, json, 'utf8');
        }
        catch (err) {
            // If the error was because the directory did no exist then make it first
            if (err.code === 'ENOENT') {
                try {
                    yield fsp.mkdir(path_1.default.dirname(annotationFilePath), { recursive: true });
                    yield fsp.writeFile(annotationFilePath, json, 'utf8');
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
    });
}
function saveRaster(dataURL, path) {
    const base64Data = dataURL.replace(/^data:image\/(png|gif|jpeg);base64,/, '');
    fs_1.default.writeFileSync(path, base64Data, 'base64');
}
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = 8000;
        // Allow CORS
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
        // Need to parse POST Body data (for parsing application/json)
        // Increase the limit from the default (100kb) to enable large annotation JSON
        // files
        app.use(body_parser_1.default.json({
            limit: '100mb',
        }));
        app.use(body_parser_1.default.text());
        // Ping
        app.get('/ping', (req, res) => {
            res.send('pong');
        });
        // Save annotation data
        app.post('/save', function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield saveAnnotation(JSON.parse(req.body));
                    res.send('Success, annotation data saved');
                }
                catch (err) {
                    console.log('Data could not be saved');
                    console.log(err);
                    res.send('Failed, annotation data could not be saved');
                }
            });
        });
        // Walk specified path and return items
        // req.body.path should be the path to the directory to check.
        app.post('/getItemsAtPath', function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const pathToCheck = req.body.path;
                    const items = yield walk(path_1.default.join(dataDir, pathToCheck), dataDir);
                    res.send(items);
                }
                catch (err) {
                    console.error('Could not get items at path');
                    console.error(err);
                    res.send('Failed, Could not get items at path');
                }
            });
        });
        // Serve static  data
        // Always respond with headers that disable the cache. Specifically this is
        // important when editing raster images. Without this, when the editor is
        // reloaded the browser will serve the original, pre-edit, from the cache.
        app.use('/data', express_1.default.static(dataDir, {
            setHeaders: function (res, path) {
                res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            },
        }));
        app.get('/iiif', function (req, res) {
            const protocol = iiifHttps ? 'https' : 'http';
            res.send(new URL('/iiif/2/', `${protocol}://${iiifHostname}:${iiifPort}`).toString());
        });
        // Serve the built application
        app.use(express_1.default.static(__dirname));
        app.route('/*').get(function (req, res) {
            res.sendFile(path_1.default.join(__dirname, 'index.html'));
        });
        // Get the IP address of the current machine. The application will also be
        // usable over the network from this address.
        const networkIPAddress = ip_1.default.address();
        // Listen to requests
        app.listen(port, () => {
            console.log('AIDA running at:');
            console.log(`- Local:   http://localhost:${port}/local`);
            console.log(`- Network: http://${networkIPAddress}:${port}/local`);
        });
    });
}
startServer();
