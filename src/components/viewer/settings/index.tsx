import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'

import Map from 'ol/Map'

import Overview from './overview'
import Layers from './layers'
import Classes from './classes'

// Settings sidebar
// Generally for 'global' settings (ones which adjust the entire view and/or all
// annotation items within the view). Layers and channels are other examples
// of 'global' settings.
const Settings = (props: { map: Map }) => {
	const { map } = props

	const [isOpen, setIsOpen] = useState(true)

	// Toggling the sidebar changes the size of the map container but Openlayers
	// isn't aware of this. So we need to manually trigger an update to map size.
	useEffect(() => {
		map.updateSize()
	}, [isOpen])

	return (
		<>
			{/* Open and close button */}
			<button
				onClick={() => setIsOpen((isOpen) => !isOpen)}
				className={`${
					isOpen
						? 'w-48 flex justify-between border-l border-b-2 ring-inset'
						: 'rounded-bl-md'
				} hover:bg-gray-100 border-gray-200 shadow p-2 bg-white absolute top-0 right-0 inline-flex items-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500`}
			>
				{!isOpen && <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />}
				Settings
				{isOpen && <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />}
			</button>

			{/* Content */}
			{isOpen && (
				<div className="bg-white border-l border-gray-200 mt-10 min-h-full w-48 shadow text-gray-800 flex flex-col divide-y">
					<div />
					<Overview map={map} />
					<Layers map={map} />
					<Classes map={map} />
					<div />
				</div>
			)}
		</>
	)
}

export default Settings
