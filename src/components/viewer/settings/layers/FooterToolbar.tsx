import { useRef } from 'react'

import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import { PlusSmIcon } from '@heroicons/react/solid'

// Manage annotation layers
const FooterToolbar = (props: { map: Map }) => {
	const { map } = props

	// Keep track of how many new layers we have created so that we can apply
	// appropriate names
	const newLayerCount = useRef(1)

	const isLayerWithName = (name: string) => {
		const layers = map.getLayers()
		const sameNameLayer = layers
			.getArray()
			.find((layer) => layer.get('id') === name)
		if (sameNameLayer !== undefined) return true
		else return false
	}

	const addNewLayer = () => {
		// Find the next free layer name
		while (isLayerWithName(`Layer ${newLayerCount.current}`)) {
			newLayerCount.current += 1
		}

		const newLayerId = `Layer ${newLayerCount.current}`

		const newLayerSource = new VectorSource({ wrapX: false })
		const unsavedChangesListener = () => map.set('unsavedChanges', true)
		newLayerSource.on(
			['addfeature', 'changefeature', 'removefeature'],
			unsavedChangesListener
		)

		const newLayer = new VectorLayer({
			source: newLayerSource,
		})
		newLayer.set('id', newLayerId)
		newLayer.set('type', 'annotation')

		map.addLayer(newLayer)
	}

	return (
		<div className="flex justify-end">
			<button
				type="button"
				className="inline-flex items-center m-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
				onClick={addNewLayer}
				title="Add new layer"
			>
				<PlusSmIcon className="h-4 w-4" aria-hidden="true" />
			</button>
		</div>
	)
}

export default FooterToolbar
