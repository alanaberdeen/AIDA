// Openlayers is not compatible with NodeJS and therefore throws an error on
// import because we're trying to use ES Modules in a NodeJS environment.
// This is the fix.
// See: https://github.com/openlayers/openlayers/issues/10470

// TODO: might not need to do this anymore. See ES Modules compatibility:
// https://github.com/openlayers/openlayers#es-modules
// The ol package contains a src/ folder with the sources, authored as ES
// Modules. To use these untranspiled sources, either import modules from
// ol/src instead of ol, or configure your bundler with an alias pointing
// to ol/src for the ol package.
const withTranspile = require('next-transpile-modules')(['ol', 'geotiff'])
module.exports = withTranspile()
