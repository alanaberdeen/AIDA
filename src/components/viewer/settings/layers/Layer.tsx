import { useState, useRef, useEffect, SyntheticEvent } from 'react'

import { Menu, Transition } from '@headlessui/react'

import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Geometry from 'ol/geom/Geometry'

import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'

// Manage annotation layers
const Layer = (props: {
	layer: VectorLayer<VectorSource<Geometry>>
	index: number
	active: boolean
	map: Map
}) => {
	const { layer, index, active, map } = props

	// Utilities for editing layer name
	const [isEditingName, setIsEditingName] = useState(false)
	const nameInputRef = useRef<HTMLInputElement>(null)
	const [nameInputValue, setNameInputValue] = useState(layer.get('id'))
	const handleNameChange = (e: SyntheticEvent) => {
		const newName = (e.target as HTMLInputElement).value
		setNameInputValue(newName)
		layer.set('id', newName)
	}

	// Utilities for toggling opacity
	const [isVisible, setIsVisible] = useState(layer.getVisible())
	const opacityCache = useRef(layer.getOpacity())
	const toggleOpacity = () => {
		if (layer.getOpacity() === 0) {
			layer.setOpacity(opacityCache.current)
		} else {
			opacityCache.current = layer.getOpacity()
			layer.setOpacity(0)
		}
	}

	// Utilities for context menu
	const [contextMenuPos, setContextMenuPos] = useState([0, 0])
	const contextMenuRef = useRef<HTMLButtonElement>(null)

	// Attach a listener for opacity changes (the opacity of this layer may also
	// be changed by the activeLayer control slider). Need to do this inside a
	// useEffect hook so we can return a cleanup function and avoid a memory leak.
	useEffect(() => {
		const listener = () => {
			setIsVisible(layer.getOpacity() !== 0)
		}
		layer.on('change:opacity', listener)
		return () => {
			layer.un('change:opacity', listener)
		}
	}, [layer])

	// Set layer active
	const setLayerActive = (layer: VectorLayer<VectorSource<Geometry>>) => {
		map.getLayers().set('active', {
			layer,
			index,
		})
	}

	return (
		<div
			className={`${
				active ? 'text-teal-800 bg-gray-100' : 'text-gray-700 bg-white'
			} flex justify-between w-full text-sm overflow-hidden`}
			onContextMenu={(e) => {
				e.preventDefault()
				if (contextMenuRef.current) contextMenuRef.current.click()
				setContextMenuPos([e.clientX, e.clientY])
			}}
		>
			<button
				type="button"
				className="m-1 inline-flex items-center text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500"
				onClick={toggleOpacity}
			>
				{isVisible ? (
					<EyeIcon className="h-4 w-4" aria-hidden="true" />
				) : (
					<EyeOffIcon className="h-4 w-4" aria-hidden="true" />
				)}
			</button>

			{/*
        This feels like a bit of a hack. We need to display the text input
        on doubleClick. But we also want to automatically focus the input. 
        Since you cannot apply focus to an unmounted/hidden DOM element it's not
        easy to toggle between them. Settled on a hack where we instead change 
        the element widths. Likely there is a cleaner solution.
      */}
			<input
				type="text"
				name="layer-name"
				ref={nameInputRef}
				className={`${
					isEditingName ? 'w-full m-1' : 'w-0'
				} block focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500 focus:border-teal-500 border-gray-300`}
				placeholder={layer.get('id')}
				onBlur={() => {
					setIsEditingName(false)
				}}
				value={nameInputValue}
				onChange={handleNameChange}
				onKeyUp={(e) => {
					if (e.key === 'Enter' && nameInputRef.current) {
						nameInputRef.current.blur()
					}
				}}
			/>

			<button
				type="button"
				className={`${
					isEditingName ? 'w-0' : 'w-full m-1'
				} truncate text-left w-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500`}
				onClick={() => setLayerActive(layer)}
				onDoubleClick={() => {
					setIsEditingName(true)
					if (nameInputRef.current) nameInputRef.current.focus()
				}}
			>
				{layer.get('id')}
			</button>

			{/* Context menu */}
			{/*
        This seems like a poor way of doing this - there is likely a better 
        solution. We are using a hidden button to open the context menu. We are
        activating that button via an onContextMenu event (see above). This is 
        because headlessUI do not expose the open state of their menu so we 
        cannot easily create a controlled component. It's a workaround.
      */}
			<Menu>
				<Menu.Button ref={contextMenuRef} />

				<Transition
					enter="transition duration-100 ease-out"
					enterFrom="scale-95 opacity-0"
					enterTo="scale-100 opacity-100"
					leave="transition duration-75 ease-out"
					leaveFrom="scale-100 opacity-100"
					leaveTo="scale-95 opacity-0"
				>
					<Menu.Items
						className={`absolute w-28 mt-2 origin-top-right -translate-x-full bg-white divide-y divide-gray-100 rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
						style={{ left: contextMenuPos[0], top: contextMenuPos[1] }}
					>
						<div className="px-1 py-1 ">
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active ? 'bg-teal-500 text-white' : 'text-gray-900'
										} group flex rounded-sm items-center w-full p-1 text-sm`}
										onClick={() => {
											map.removeLayer(layer)
										}}
									>
										Delete
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	)
}

export default Layer
