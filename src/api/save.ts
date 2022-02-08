// Packages
import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Geometry from 'ol/geom/Geometry'

import createSimpleId from '../lib/utils/createSimpleId'

// Types
import { Annotation } from '../types/annotation'
import type Point from 'ol/geom/Point'
import type LineString from 'ol/geom/LineString'
import type Polygon from 'ol/geom/Polygon'

type FeatureGeom = Point | LineString | Polygon

// Initial default template for new annotation data
const defaultAnnotation: Annotation = {
	header: {
		schemaVersion: '2.0',
		timestamp: Date.now(),
	},
	layers: [],
	classes: [],
}

// Save the annotation data
export const save = async (map: Map) => {
	const annotation = { ...defaultAnnotation }

	// Update header timestamp
	annotation.header.timestamp = Date.now()

	// Add feature classes
	const featureClasses = map.get('featureClasses')
	annotation.classes = Object.values(featureClasses)

	// Add layers
	const layers = map.getLayers()
	const annotationLayers = layers
		.getArray()
		.filter((layer) => layer.get('type') === 'annotation')

	annotation.layers = annotationLayers.map((layer) => {
		const features = (layer as VectorLayer<VectorSource<Geometry>>)
			.getSource()
			.getFeatures()

		// Extract features
		// TODO: fix type problems with the below when using Feature[]
		const layerFeatures: any[] = features.flatMap((feature) => {
			const geometry = feature.getGeometry()

			if (geometry) {
				const geometryType = geometry.getType()
				const geometryCoordinates = (geometry as FeatureGeom).getCoordinates()

				return {
					id: feature.get('id') || createSimpleId(),
					class: feature.get('class'),
					geometry: {
						type: geometryType,
						coordinates: geometryCoordinates,
					},
				}
			} else return []
		})

		return {
			id: layer.get('id'),
			features: layerFeatures,
		}
	})

	// Extract path from window URL
	const pathname = window.location.pathname

	// Default annotation path
	let annotationPath = pathname.replace(/\.[^.]+$/, '.json')

	// If path ends in .json we assume open a project file. Therefore, we need to
	// find and adjust the correct path for the annotation data.
	if (pathname.endsWith('.json')) {
		const projectResponse = await fetch(`http://localhost:8000/data${pathname}`)
		if (projectResponse.ok) {
			const projectResponseJson = await projectResponse.json()
			annotationPath = projectResponseJson.annotation
		}
	}

	// Send request
	// Default port for localServer is 8000
	const host = 'http://localhost:8000'

	try {
		await fetch(`${host}/save`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				annotationPath,
				annotationData: annotation,
			}),
		})
		map.set('unsavedChanges', false)
	} catch (err) {
		console.error(err)
	}
}
