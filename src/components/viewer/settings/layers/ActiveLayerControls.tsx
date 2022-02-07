import { useState, useEffect } from 'react'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Geometry from 'ol/geom/Geometry'

import Slider from '../../../interaction/Slider'

// Manage annotation layers
const ActiveLayerControls = (props: {
	activeLayer: VectorLayer<VectorSource<Geometry>>
}) => {
	const { activeLayer } = props

	// Opacity controls
	const handleOpacityChange = (value: number[]) => {
		const newOpacity = typeof value === 'number' ? value : value[0]
		activeLayer.setOpacity(newOpacity)
	}

	const [opacity, setOpacity] = useState(activeLayer.getOpacity())

	// Listen to opacity changes (the opacity of this layer may also be changed
	// by visibility toggle button). Do inside a useEffect so that we can return
	// a cleanup function to remove the listener and avoid a memory leak.
	useEffect(() => {
		const listener = () => {
			setOpacity(activeLayer.getOpacity())
		}
		activeLayer.on('change:opacity', listener)
		return () => {
			activeLayer.un('change:opacity', listener)
		}
	}, [activeLayer])

	return (
		<div className="flex items-center">
			{/* Opacity slider */}
			<Slider
				minValue={0}
				maxValue={1}
				step={0.01}
				aria-label={`Layer ${activeLayer.get('id')} opacity`}
				value={[opacity]}
				onChange={handleOpacityChange}
				formatOptions={{ style: 'percent' }}
			/>
		</div>
	)
}

export default ActiveLayerControls
