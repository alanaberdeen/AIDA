const fs = require('fs')
const replaceExt = require('replace-ext')

function changeTxtToJSON() {
  let args = process.argv.slice(2)
  let directoryToMegaValidations = './' + String(args[0])

  fs.readdir(directoryToMegaValidations, (err, files) => {

    files.forEach(file => {
      let path = directoryToMegaValidations + '/' + file
      let newPath = replaceExt(path, '.json')

      fs.rename(path, newPath, function (err) {
        if (err) console.log('ERROR: ' + err);
      })
    })

    if (err) {
      console.log('Could not read all files. Returned error: ' + err)
    }
  })
}

if (require.main === module) {
  changeTxtToJSON()
}