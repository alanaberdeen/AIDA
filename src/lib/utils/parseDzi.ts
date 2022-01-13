// .dzi files are weird annoying XML nonsense here's some utilities to handle
// them nicely. For info and Deep Zoom schema details see:
// https://docs.microsoft.com/en-us/previous-versions/windows/silverlight/dotnet-windows-silverlight/cc645077(v=vs.95)
import { parseStringPromise } from 'xml2js'

// Parses the XML and returns a workable object.
// It's expected that we only use a subset of the possible parameters
const parseDzi = async (xml: string) => {
	const xmlObject = await parseStringPromise(xml)

	// Check if we have the expected properties.
	// If not, throw an error.
	// Is this the best way to do this...?
	if (!xmlObject.hasOwnProperty('Image'))
		throw new Error('Invalid DZI: no <Image> specification.')
	if (!xmlObject.Image.hasOwnProperty('$'))
		throw new Error(
			'Invalid DZI: invalid <Image> specification (expected strange $ xml parsing).'
		)
	if (!xmlObject.Image.$.hasOwnProperty('Format'))
		throw new Error('Invalid DZI: no <Image><Format> specification.')
	if (!xmlObject.Image.$.hasOwnProperty('Overlap'))
		throw new Error('Invalid DZI: no <Image><Overlap> specification.')
	if (!xmlObject.Image.$.hasOwnProperty('TileSize'))
		throw new Error('Invalid DZI: no <Image><TileSize> specification.')
	if (!xmlObject.Image.hasOwnProperty('Size'))
		throw new Error('Invalid DZI: no <Image><Size> specification.')
	if (!xmlObject.Image.Size[0].hasOwnProperty('$'))
		throw new Error(
			'Invalid DZI: invalid <Image><Size> specification (expected strange $ xml parsing).'
		)
	if (!xmlObject.Image.Size[0].$.hasOwnProperty('Width'))
		throw new Error('Invalid DZI: no <Image><Size><Width> specification.')
	if (!xmlObject.Image.Size[0].$.hasOwnProperty('Height'))
		throw new Error('Invalid DZI: no <Image><Size><Height> specification.')

	return {
		format: xmlObject.Image.$.Format,
		overlap: Number(xmlObject.Image.$.Overlap),
		tileSize: Number(xmlObject.Image.$.TileSize),
		size: {
			width: Number(xmlObject.Image.Size[0].$.Width),
			height: Number(xmlObject.Image.Size[0].$.Height),
		},
	}
}

export { parseDzi }
