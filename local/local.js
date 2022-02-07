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
const ini_1 = __importDefault(require("ini"));
// Read configuration file
const config = ini_1.default.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'config.ini'), 'utf-8'));
const dataDir = path_1.default.isAbsolute(config.data_dir)
    ? config.data_dir
    : path_1.default.join(__dirname, config.data_dir);
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
                const { annotationPath, annotationData } = req.body;
                const absolutePath = path_1.default.join(dataDir, annotationPath);
                try {
                    const json = JSON.stringify(annotationData);
                    try {
                        yield fsp.writeFile(absolutePath, json, 'utf8');
                    }
                    catch (err) {
                        // If the error was because the directory did not exist then make it first
                        if (err.code === 'ENOENT') {
                            try {
                                yield fsp.mkdir(path_1.default.dirname(absolutePath), {
                                    recursive: true,
                                });
                                yield fsp.writeFile(absolutePath, json, 'utf8');
                            }
                            catch (err) {
                                console.log(err);
                            }
                        }
                    }
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
        // Listen to requests
        app.listen(port, () => {
            console.log('AIDA running:');
        });
    });
}
startServer();
