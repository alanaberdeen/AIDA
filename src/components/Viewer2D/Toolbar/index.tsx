import { useState, useEffect } from 'react'

import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Geometry from 'ol/geom/Geometry'
import Draw from 'ol/interaction/Draw'
import DragPan from 'ol/interaction/DragPan'
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom'
import DragRotate from 'ol/interaction/DragRotate'
import Select from 'ol/interaction/Select'
import DragBox from 'ol/interaction/DragBox'
import Translate from 'ol/interaction/Translate'
import Modify from 'ol/interaction/Modify'
import { createBox } from 'ol/interaction/Draw'
import * as olExtent from 'ol/extent'
import Feature from 'ol/Feature'
import { Style, Fill, Stroke } from 'ol/style'

// Toolbar component
// Hovers over the image canvas.
// Generally for interactive tools - for example line or polygon drawing tools.
const Toolbar = (props: { map: Map }) => {
	const { map } = props

	const tools = [
		'pan',
		'select',
		'modify',
		'point',
		'lineString',
		'polygon',
		'box',
	]

	// Get a reference to the vector source where the annotations will be stored.
	// This use of 'as' in the type definition might be somewhat risky...
	// essentially we know (?!) that the layer with this property both exists and
	// is a VectorLayer so we can explicitly cast it as such.
	const vectorLayer = map.getLayers().get('active').layer as VectorLayer<
		VectorSource<Geometry>
	>

	const [activeTool, setActiveTool] = useState('pan')
	const [vectorSource, setVectorSource] = useState(vectorLayer.getSource())

	// Listen to changes to the active property on the layers collection
	// when the activeLayer updates we need to re-set all of the tools as they
	// are layer, and therefore source, specific.
	useEffect(() => {
		const layers = map.getLayers()
		const listener = () => {
			const activeLayer = layers.get('active').layer
			if (activeLayer) setVectorSource(activeLayer.getSource())
		}

		layers.on('propertychange', listener)
		return () => {
			layers.un('propertychange', listener)
		}
	}, [])

	// Array placeholder for any copied features
	let clipboardFeatures: Feature<Geometry>[] = []

	// Mouse position is useful in some interactions (e.g. pasting a feature(s))
	let mousePos = [0, 0]
	map.on('pointermove', (event) => {
		mousePos = event.coordinate
	})

	// Callback to set the class of a newly created feature to the active class
	const setClass = (e) => {
		const featureClass =
			map.get('featureClasses')[map.get('activeFeatureClass')]
		e.feature.set('class', featureClass.id)

		e.feature.setStyle(
			new Style({
				stroke: new Stroke({
					color: featureClass.style.stroke.color,
					width: featureClass.style.stroke.width,
				}),
			})
		)

		if (featureClass.style.fill) {
			e.feature.setStyle(
				new Style({
					fill: new Fill({
						color: featureClass.style.fill.color,
					}),
					stroke: new Stroke({
						color: featureClass.style.stroke.color,
						width: featureClass.style.stroke.width,
					}),
				})
			)
		}
	}

	// Initialise tools
	useEffect(() => {
		// Clear any previously set interactions
		map.getInteractions().clear()

		// conditionalDragPan
		// Always be able to drag and pan the map with the middle mouse button
		const conditionalDragPan = new DragPan({
			condition: (e) => e.originalEvent.button === 1,
		})
		conditionalDragPan.set('id', 'conditionalDragPan')

		// mouseWheelZoom
		const mouseWheelZoom = new MouseWheelZoom()
		mouseWheelZoom.setActive(true)
		mouseWheelZoom.set('id', 'mouseWheelZoom')

		// pan
		const pan = new DragPan()
		pan.set('id', 'pan')

		// rotate
		const rotate = new DragRotate()
		rotate.set('id', 'rotate')

		// select
		const select = new Select()
		select.setActive(false)
		select.set('id', 'select')

		// dragBox - selects features inside a user specified region
		const dragBox = new DragBox({
			className: 'border border-blue-500 bg-gray-50 bg-opacity-25',
		})
		dragBox.on('boxend', () => {
			const extent = dragBox.getGeometry().getExtent()
			const features = vectorSource.getFeaturesInExtent(extent)
			select.getFeatures().clear()
			select.getFeatures().extend(features)
		})
		dragBox.setActive(false)
		dragBox.set('id', 'dragBox')

		// translate
		const translate = new Translate({ features: select.getFeatures() })
		translate.setActive(false)
		translate.set('id', 'translate')

		// modify
		// By default, the interaction will allow deletion of vertices when the alt
		// key is pressed.
		const modify = new Modify({ features: select.getFeatures() })
		modify.setActive(false)
		modify.set('id', 'modify')

		// box
		const box = new Draw({
			source: vectorSource,
			type: 'Circle',
			geometryFunction: createBox(),
		})
		box.setActive(false)
		box.set('id', 'box')
		box.on('drawend', setClass)

		// point
		const point = new Draw({
			source: vectorSource,
			type: 'Point',
		})
		point.setActive(false)
		point.set('id', 'point')

		// lineString
		const lineString = new Draw({
			source: vectorSource,
			type: 'LineString',
		})
		lineString.setActive(false)
		lineString.set('id', 'lineString')

		// polygon
		const polygon = new Draw({
			source: vectorSource,
			type: 'Polygon',
		})
		polygon.setActive(false)
		polygon.set('id', 'polygon')
		polygon.on('drawend', setClass)

		map
			.getInteractions()
			.extend([
				conditionalDragPan,
				mouseWheelZoom,
				pan,
				rotate,
				select,
				dragBox,
				translate,
				modify,
				box,
				point,
				lineString,
				polygon,
			])
	}, [map, vectorSource])

	// Update the active tool
	useEffect(() => {
		// Which tools we should activate depends on the activeTool as selected by
		// the user. Some tools are actually a combination of multiple interactions.
		const activeInteractions = ['mouseWheelZoom', 'conditionalDragPan']

		switch (activeTool) {
			case 'pan':
				activeInteractions.push('pan', 'rotate')
				break
			case 'select':
				activeInteractions.push('select', 'translate', 'dragBox')
				break
			case 'modify':
				activeInteractions.push('modify', 'select', 'dragBox')
				break
			case 'point':
				activeInteractions.push('point')
				break
			case 'lineString':
				activeInteractions.push('lineString')
				break
			case 'polygon':
				activeInteractions.push('polygon')
				break
			case 'box':
				activeInteractions.push('box')
				break
			default:
				activeInteractions.push('pan')
				break
		}

		// Activate the selected interactions
		const interactions = map.getInteractions().getArray()
		interactions.forEach((interaction) => {
			if (activeInteractions.includes(interaction.get('id'))) {
				interaction.setActive(true)
			} else {
				interaction.setActive(false)
			}
		})
	}, [activeTool, map, vectorSource])

	// Setup keyboard shortcuts
	// TODO: support copy/paste
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Only respond to keydown events when no other interactive element (such
			// as a menu button or text input) is focused.
			if (event.code && document.activeElement === document.body) {
				switch (event.code) {
					case 'Space':
						event.preventDefault()
						setActiveTool('pan')
						break
					case 'Digit1':
						event.preventDefault()
						setActiveTool(tools[0])
						break
					case 'Digit2':
						event.preventDefault()
						setActiveTool(tools[1])
						break
					case 'Digit3':
						event.preventDefault()
						setActiveTool(tools[2])
						break
					case 'Digit4':
						event.preventDefault()
						setActiveTool(tools[3])
						break
					case 'Digit5':
						event.preventDefault()
						setActiveTool(tools[4])
						break
					case 'Digit6':
						event.preventDefault()
						setActiveTool(tools[5])
						break
					case 'Digit7':
						event.preventDefault()
						setActiveTool(tools[6])
						break
					case 'KeyA':
						event.preventDefault()

						// On Ctrl+A, select all features
						if (event.ctrlKey) {
							setActiveTool('select')

							const vectorLayer = map
								.getLayers()
								.getArray()
								.find(
									(layer) => layer.get('type') === 'annotation'
								) as VectorLayer<VectorSource<Geometry>>
							const features = vectorLayer.getSource().getFeatures()

							const selectTool = map
								.getInteractions()
								.getArray()
								.find(
									(interaction) => interaction.get('id') === 'select'
								) as Select
							selectTool.getFeatures().clear()
							selectTool.getFeatures().extend(features)
						}
						break
					case 'KeyC':
						event.preventDefault()

						// On Ctrl+C, copy selected features
						if (event.ctrlKey) {
							const selectTool = map
								.getInteractions()
								.getArray()
								.find(
									(interaction) => interaction.get('id') === 'select'
								) as Select

							// HACK: we need to copy the features with their original styles
							// it's difficult to do this properly. Here we use private methods
							// on the Select class to revert the feature back to its original
							// style, clone it, and then re-apply the select style.
							clipboardFeatures = selectTool
								.getFeatures()
								.getArray()
								.map((f) => {
									// @ts-ignore: private method
									selectTool.restorePreviousStyle_(f)
									const clonedFeature = f.clone()
									// @ts-ignore: private method
									selectTool.applySelectedStyle_(f)
									return clonedFeature
								})
						}
						break
					case 'KeyV':
						event.preventDefault()

						// On Ctrl+V, paste copied features
						if (event.ctrlKey) {
							// Create extent of copied features
							const extent = clipboardFeatures.reduce((extent, feature) => {
								return olExtent.extend(
									extent,
									feature.getGeometry().getExtent()
								)
							}, olExtent.createEmpty())

							// Get center of features extent
							const copiedCenter = olExtent.getCenter(extent)

							// Find difference between mouse position and center of copied
							// features
							const delta = mousePos.map((p, index) => p - copiedCenter[index])

							// Translate copied features by delta
							const translatedFeatures = clipboardFeatures.map((feature) => {
								const newFeature = feature.clone()
								newFeature.getGeometry().translate(delta[0], delta[1])
								return newFeature
							})

							// Add translated features to vector source
							const vectorLayer = map
								.getLayers()
								.getArray()
								.find(
									(layer) => layer.get('type') === 'annotation'
								) as VectorLayer<VectorSource<Geometry>>
							const vectorSource = vectorLayer.getSource()
							vectorSource.addFeatures(translatedFeatures)
						}
						break
					case 'Delete':
					case 'Backspace':
						event.preventDefault()
						const selectTool = map
							.getInteractions()
							.getArray()
							.find(
								(interaction) => interaction.get('id') === 'select'
							) as Select
						while (selectTool.getFeatures().getLength() > 0) {
							const feature = selectTool.getFeatures().pop()
							vectorSource.removeFeature(feature)
						}
						break
					default:
						break
				}
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => document.removeEventListener('keydown', handleKeyDown)
	})

	return (
		<div className="absolute left-0 top-0 z-20 flex flex-col m-1 bg-gray-100 rounded-lg pointer-events-auto border border-gray-300">
			{tools?.includes('pan') && (
				<button
					className={`${
						activeTool === 'pan' ? 'text-teal-700 bg-gray-200' : 'text-gray-500'
					} block border-b rounded-t-lg p-2 text-sm leading-5 font-medium hover:bg-gray-50 active:bg-gray-100 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
					onClick={() => setActiveTool('pan')}
					aria-label="Activate pan tool"
					title="Pan"
					type="button"
				>
					<svg
						viewBox="0 0 20 20"
						fill="currentColor"
						className="cursor-click w-4 h-4"
					>
						<path
							fillRule="evenodd"
							d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			)}

			{tools?.includes('select') && (
				<button
					className={`${
						activeTool === 'select'
							? 'text-teal-700 bg-gray-200'
							: 'text-gray-500'
					} block p-2 text-sm leading-5 font-medium hover:bg-gray-50 active:bg-gray-100 transition ease-in-out duration-150  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
					onClick={() => setActiveTool('select')}
					aria-label="Activate select tool"
					title="Select"
					type="button"
				>
					<svg
						viewBox="0 0 24 24"
						fill="currentColor"
						className="cursor-click w-4 h-4"
					>
						<path d="M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z" />
					</svg>
				</button>
			)}

			{tools?.includes('modify') && (
				<button
					className={`${
						activeTool === 'modify'
							? 'text-teal-700 bg-gray-200'
							: 'text-gray-500'
					} block border-b p-2 text-sm leading-5 font-medium hover:bg-gray-50 active:bg-gray-100 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
					onClick={() => setActiveTool('modify')}
					aria-label="Activate modify tool"
					title="Modify"
					type="button"
				>
					<svg
						viewBox="0 0 24 24"
						fill="currentColor"
						className="cursor-click w-4 h-4"
					>
						<path d="M12,20L7,22L12,11L17,22L12,20M8,2H16V5H22V7H16V10H8V7H2V5H8V2M10,4V8H14V4H10Z" />
					</svg>
				</button>
			)}

			{tools?.includes('point') && (
				<button
					className={`${
						activeTool === 'point'
							? 'text-teal-700 bg-gray-200'
							: 'text-gray-500'
					} block border-b p-2 text-sm leading-5 font-medium hover:bg-gray-50 active:bg-gray-100 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
					onClick={() => setActiveTool('point')}
					aria-label="Activate point tool"
					title="Point"
					type="button"
				>
					<svg
						viewBox="0 0 24 24"
						fill="currentColor"
						stroke="currentColor"
						className="cursor-click w-4 h-4"
					>
						<path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
					</svg>
				</button>
			)}

			{tools?.includes('lineString') && (
				<button
					className={`${
						activeTool === 'lineString'
							? 'text-teal-700 bg-gray-200'
							: 'text-gray-500'
					} block border-b p-2 text-sm leading-5 font-medium hover:bg-gray-50 active:bg-gray-100 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
					onClick={() => setActiveTool('lineString')}
					aria-label="Activate line-string tool"
					title="LineString"
					type="button"
				>
					<svg
						viewBox="0 0 24 24"
						fill="currentColor"
						className="cursor-click w-4 h-4"
					>
						<path d="M3.5,18.5L9.5,12.5L13.5,16.5L22,6.92L20.59,5.5L13.5,13.5L9.5,9.5L2,17L3.5,18.5Z" />
					</svg>
				</button>
			)}

			{tools?.includes('polygon') && (
				<button
					className={`${
						activeTool === 'polygon'
							? 'text-teal-700 bg-gray-200'
							: 'text-gray-500'
					} block p-2 text-sm leading-5 font-medium hover:bg-gray-50 active:bg-gray-100 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
					onClick={() => setActiveTool('polygon')}
					aria-label="Activate polygon tool"
					title="Polygon"
					type="button"
				>
					<svg
						viewBox="0 0 24 24"
						fill="currentColor"
						className="cursor-click w-4 h-4"
					>
						<path d="M17,15.7V13H19V17L10,21L3,14L7,5H11V7H8.3L5.4,13.6L10.4,18.6L17,15.7M22,5V7H19V10H17V7H14V5H17V2H19V5H22Z" />
					</svg>
				</button>
			)}

			{tools?.includes('box') && (
				<button
					className={`${
						activeTool === 'box' ? 'text-teal-700 bg-gray-200' : 'text-gray-500'
					} block p-2 rounded-b-lg text-sm leading-5 font-medium hover:bg-gray-50 active:bg-gray-100 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
					onClick={() => setActiveTool('box')}
					aria-label="Activate box tool"
					title="Box"
					type="button"
				>
					<svg
						viewBox="0 0 24 24"
						fill="currentColor"
						className="cursor-click w-4 h-4"
					>
						<path d="M4,6V19H20V6H4M18,17H6V8H18V17Z" />
					</svg>
				</button>
			)}
		</div>
	)
}

export default Toolbar
