import { useState, useEffect, useRef } from 'react'

import Map from 'ol/Map'
import OverviewMap from 'ol/control/OverviewMap'
import TileLayer from 'ol/layer/Tile'
import Zoomify from 'ol/source/Zoomify'

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

// Overview shows a high-level overview of the map, indicating the current size
// and position of the viewport.
const Overview = (props: { map: Map }) => {
	const { map } = props

	const overviewEl = useRef(null)

	const [isOpen, setIsOpen] = useState(true)

	useEffect(() => {
		const imageLayer = map
			.getLayers()
			.getArray()
			.find((layer) => layer.get('id') === 'image') as TileLayer<Zoomify>
		const imageSource = imageLayer.getSource()

		const overview = new OverviewMap({
			className: 'overview ol-overviewmap',
			collapsible: false,
			layers: [
				new TileLayer({
					source: imageSource,
				}),
			],
			target: overviewEl.current || undefined,
		})
		map.addControl(overview)
	}, [map])

	return (
		<div>
			<button
				className={classNames(
					'text-gray-700 hover:bg-gray-50 hover:text-gray-900 bg-white group w-full flex items-center pr-2 py-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 relative z-10 ring-inset'
				)}
				onClick={() => setIsOpen(!isOpen)}
			>
				<svg
					className={classNames(
						isOpen ? 'text-gray-400 rotate-90' : 'text-gray-300',
						'mr-2 shrink-0 h-5 w-5 group-hover:text-gray-400 transition-colors ease-in-out duration-150'
					)}
					viewBox="0 0 20 20"
					aria-hidden="true"
				>
					<path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
				</svg>
				Overview
			</button>
			<div
				ref={overviewEl}
				className={`${!isOpen ? 'hidden bg-gray-50' : ''} h-32`}
			/>
		</div>
	)
}

export default Overview
