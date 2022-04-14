"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    // Local static server for 2D and 3D models.
    server: {
        path: '',
        hostname: 'localhost',
        port: 8000,
    },
    // Client application
    app: {
        port: 3000,
    },
    // IIIF - tiling image server for .tiff
    IIIF: {
        hostname: 'localhost',
        port: 8182,
        https: false,
    },
};
exports.default = config;
