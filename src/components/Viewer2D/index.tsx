import { useEffect, useState } from 'react'

import Map from 'ol/Map'
import View from 'ol/View'
import Zoomify from 'ol/source/Zoomify'
import Proj from 'ol/proj/Projection'
import TileLayer from 'ol/layer/Tile'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'

import { parseDzi } from '../../lib/utils/parseDzi'

import Toolbar from './Toolbar'
import Viewer from './Viewer'
import Settings from './Settings'

const Viewer2D = (props: { imageUrl: string }) => {
	const { imageUrl } = props

	const [map, setMap] = useState(null)

	// Instantiate map object here so all child components will all have access
	// via props. Annoyingly, we can only create our Map object once the page has
	// rendered. This is because openLayers expects to have access to the document
	// object. Hence, we use useEffect to wait until the page has loaded.
	// Setup the map, image layer and source based on provided URL
	// At the moment we expect the URL to be a .dzi file.
	// TODO: handle .tiff image servers
	useEffect(() => {
		;(async () => {
			const map = new Map({ controls: [] })
			const response = await fetch(imageUrl)
			const dzi = await parseDzi(await response.text())

			// Maps always need a projection, but image are not geo-referenced, and
			// are only measured in pixels.  So, we create a fake projection that the
			// map can use to properly display the layer. Not sure how
			// meaningful this is but seems like good practice.
			// NOTE: the axes orientation is origin top, left with positive Y up.
			//       therefore need to take care with the sign of the y-axis.
			const projection = new Proj({
				code: 'ZOOMIFY',
				units: 'pixels',
				extent: [0, -dzi.size.height, dzi.size.width, 0],
			})

			// IMAGE LAYER -----------------------------------------------------------
			const baseUrl = imageUrl.substring(0, imageUrl.lastIndexOf('.'))
			const templateUrl = `${baseUrl}_files/{z}/{x}_{y}.${dzi.format}`
			const tileSource = new Zoomify({
				projection,
				url: templateUrl,
				size: [dzi.size.width, dzi.size.height],
				tileSize: dzi.tileSize,
			})

			// We're using the Zoomify source but .dzi will have an offset that we
			// need to account for.
			const offset = Math.ceil(Math.log(dzi.tileSize) / Math.LN2)

			// The Zoomify source we are using expects a {TileGroup} variable. We
			// are adapting it to work with .dzi by adjusting the setTileUrlFunction.
			// However, there will be a single 404 request. This is because the
			// tileSource has already attempted to load before we can specify the
			// following TileUrlFunction. A shame this can't be provided to the
			// Zoomify source constructor at initialisation time.
			tileSource.setTileUrlFunction((tileCoord) => {
				return templateUrl
					.replace('{z}', (tileCoord[0] + offset).toString())
					.replace('{x}', tileCoord[1].toString())
					.replace('{y}', tileCoord[2].toString())
			})

			const tileLayer = new TileLayer({ source: tileSource })
			tileLayer.set('id', 'image')
			tileLayer.set('type', 'image')
			map.addLayer(tileLayer)

			// ANNOTATION LAYER ------------------------------------------------------
			const vectorSource = new VectorSource({ wrapX: false })

			// Add listeners to the vectorSource that set a property on the map when
			// there are unsaved changes to the vector source.
			const unsavedChangesListener = () => {
				map.set('unsavedChanges', true)
			}
			vectorSource.on(
				['addfeature', 'changefeature', 'removefeature'],
				unsavedChangesListener
			)

			// Default first layer
			const vectorLayer = new VectorLayer({ source: vectorSource })
			vectorLayer.set('id', 'Layer 1')
			vectorLayer.set('type', 'annotation')
			map.addLayer(vectorLayer)
			map.getLayers().set('active', { layer: vectorLayer, index: 0 })

			// FEATURES --------------------------------------------------------------
			// Set default feature class
			map.set('featureClasses', {
				0: {
					id: 0,
					name: 'Default class',
					description: 'Default feature class.',
					style: {
						stroke: {
							color: [51, 153, 204],
							width: 1.25,
						},
						fill: {
							color: [255, 255, 255, 0.4],
						},
					},
				},
			})
			map.set('activeFeatureClass', 0)

			// VIEW ------------------------------------------------------------------
			const view = new View({
				center: [dzi.size.width / 2, dzi.size.height / 2],
				resolutions: tileSource.getTileGrid().getResolutions(),
				extent: tileSource.getTileGrid().getExtent(),
				showFullExtent: true,
			})
			map.setView(view)
			view.fit(tileSource.getTileGrid().getExtent())

			setMap(map)

			// Cleanup function
			return () => {
				// Remove unsaved changes listener
				vectorSource.un(
					['addfeature', 'changefeature', 'removefeature'],
					unsavedChangesListener
				)
			}
		})()
	}, [imageUrl])

	return (
		<div className="min-w-full min-h-screen flex bg-white">
			{/* Toolbar */}
			{map && <Toolbar map={map} />}

			{/* Image view */}
			{map && <Viewer map={map} />}

			{/* Right settings sidebar */}
			{map && <Settings map={map} />}
		</div>
	)
}

export default Viewer2D
