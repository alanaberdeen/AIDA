import { useState, useEffect } from 'react'
import Map from 'ol/Map'
import Style from 'ol/style/Style'
import { Color, asArray } from 'ol/color'
import Fill from 'ol/style/Fill'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Geometry from 'ol/geom/Geometry'

import Slider from '../../../interaction/Slider'

// Types
import { FeatureClass } from '../../../../types/annotation'
import Select from 'ol/interaction/Select'

// Manage annotation layers
const ActiveClassControls = (props: {
	activeFeatureClass: FeatureClass
	map: Map
}) => {
	const { activeFeatureClass, map } = props

	// Reference to the select tool
	const selectTool = map
		.getInteractions()
		.getArray()
		.find((i) => i.get('id') === 'select')

	// Opacity controls
	const handleOpacityChange = (value: number[]) => {
		// HACK: opacity changes break when a feature is selected due to the applied
		// style function for selection indicator. The workaround is to first
		// deselect all features then apply the style changes.
		// TODO: find a better way to do this.
		if (selectTool && selectTool instanceof Select)
			selectTool.getFeatures().clear()

		const newOpacity = typeof value === 'number' ? value : value[0]

		// Get active features
		const annotationLayer = map
			.getLayers()
			.getArray()
			.find((layer) => layer.get('type') === 'annotation') as VectorLayer<
			VectorSource<Geometry>
		>
		const annotationSource = annotationLayer.getSource()
		const activeFeatures = annotationSource
			.getFeatures()
			.filter((feature) => feature.get('class') === activeFeatureClass.id)

		// There doesn't seem to be a way to set the opacity of feature (or]
		// collection of features) directly. Instead you have to set the color on
		// the stroke and fill and manually change the alpha value. This is a bit
		// clunky.
		activeFeatures.forEach((feature) => {
			const currentStyle = feature.getStyle() as Style
			const currentFillColor = asArray(
				currentStyle.getFill().getColor() as Color
			)
			const newStroke = currentStyle.getStroke().clone()
			const currentStrokeColor = asArray(
				currentStyle.getStroke().getColor() as Color
			)
			newStroke.setColor([...currentStrokeColor.slice(0, 3), newOpacity])

			// Set new opacity
			feature.setStyle(
				new Style({
					fill: new Fill({
						color: [...currentFillColor.slice(0, 3), newOpacity],
					}),
					stroke: newStroke,
				})
			)
		})

		// Update component state to reflect new opacity
		setOpacity(newOpacity)

		if (activeFeatureClass.style.fill) {
			activeFeatureClass.style.fill.color[3] = newOpacity
			const previousFeatureClasses = map.get('featureClasses')
			previousFeatureClasses[activeFeatureClass.id].style.fill.color =
				activeFeatureClass.style.fill.color
			map.set('featureClasses', previousFeatureClasses)
		}

		// HACK: change a property on the map to a new value in order to trigger
		// a listener that will check the opacity value of the active features.
		// This a work-around because the listener cannot detect change on the
		// larger nested object.
		map.set('change', Math.random())
	}

	const [opacity, setOpacity] = useState<number>(
		activeFeatureClass.style.fill?.color[3] || 1
	)

	// Listen to opacity changes (the opacity of this feature class may also be
	// changed by visibility toggle button). Do inside a useEffect so that we can
	// return a cleanup function to remove the listener and avoid a memory leak.
	useEffect(() => {
		const listener = () =>
			setOpacity(activeFeatureClass.style.fill?.color[3] || 1)
		map.on('propertychange', listener)
		return () => {
			map.un('propertychange', listener)
		}
	}, [activeFeatureClass, map])

	return (
		<div className="flex items-center">
			{/* Opacity slider */}
			<Slider
				minValue={0}
				maxValue={1}
				step={0.01}
				aria-label={`Layer ${activeFeatureClass.id} opacity`}
				value={[opacity]}
				onChange={handleOpacityChange}
				formatOptions={{ style: 'percent' }}
			/>
		</div>
	)
}

export default ActiveClassControls
