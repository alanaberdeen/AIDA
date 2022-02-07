// Utilities for managing features.

import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import Polygon from 'ol/geom/Polygon'
import { Style, Fill, Stroke } from 'ol/style'

// Types
import {
	Feature as FeatureType,
	FeatureClass,
	Point as PointFeature,
	LineString as LineStringFeature,
	Polygon as PolygonFeature,
} from '../../types/annotation'

// Convert JSON annotation feature to Openlayers feature
export default function parseFeature(
	inputFeature: FeatureType,
	classes: FeatureClass[]
): Feature<Point | LineString | Polygon> {
	// De-serialize the coordinates from their Firestore string representation
	const coordinates = inputFeature.geometry.coordinates

	const outputFeature = new Feature() as Feature<Point | LineString | Polygon>

	// Check feature type and set appropriate geometry.
	switch (inputFeature.geometry.type) {
		case 'Point':
			outputFeature.setGeometry(
				new Point(coordinates as PointFeature['coordinates'])
			)
			break
		case 'LineString':
			outputFeature.setGeometry(
				new LineString(coordinates as LineStringFeature['coordinates'])
			)
			break
		case 'Polygon':
			outputFeature.setGeometry(
				new Polygon(coordinates as PolygonFeature['coordinates'])
			)
			break
		default:
			break
	}

	// Check class and set appropriate styles.
	if (Object.hasOwnProperty.call(inputFeature, 'class')) {
		const inputFeatureClass = classes.find((c) => c.id === inputFeature.class)

		let style
		if (inputFeatureClass && inputFeatureClass.style.fill) {
			style = new Style({
				stroke: new Stroke({
					color: inputFeatureClass.style.stroke.color || [128, 100, 211, 1],
					width: inputFeatureClass.style.stroke.width || 1,
				}),
				fill: new Fill({
					color: inputFeatureClass.style.fill.color,
				}),
			})
		} else {
			style = new Style({
				stroke: new Stroke({
					color: (inputFeatureClass &&
						inputFeatureClass.style.stroke.color) || [128, 100, 211, 1],
					width:
						(inputFeatureClass && inputFeatureClass.style.stroke.width) || 1,
				}),
			})
		}

		outputFeature.setStyle(style)
	}

	// Add the remaining properties, but remove 'geometry' as it is redundant.
	Object.keys(inputFeature).forEach((key) => {
		if (key !== 'geometry') {
			outputFeature.set(key, inputFeature[key as keyof FeatureType])
		}
	})

	return outputFeature
}
