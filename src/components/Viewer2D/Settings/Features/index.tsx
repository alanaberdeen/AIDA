import { useState, Dispatch } from 'react'
import { Disclosure } from '@headlessui/react'

import Map from 'ol/Map'

import ActiveClassControls from './ActiveClassControls'
import FeatureClass from './FeatureClass'
import FooterToolbar from './FooterToolbar'

// Types
import { IFeatureClass } from './types'

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

// Manage annotation layers, make adjustments such as opacity, etc.
const Features = (props: { map: Map }) => {
	const { map } = props

	const [featureClasses, setFeatureClasses]: [
		IFeatureClass[],
		Dispatch<IFeatureClass[]>
	] = useState(map.get('featureClasses') || [])
	const [activeFeatureClass, setActiveFeatureClass]: [
		IFeatureClass,
		Dispatch<IFeatureClass>
	] = useState(map.get('featureClasses')[0])

	return (
		<Disclosure className="shadow-sm" as="div">
			{({ open }) => (
				<>
					<Disclosure.Button
						className={classNames(
							open ? 'rounded-t-sm border-b-2' : 'rounded-sm border-b-0',
							'text-gray-700 hover:bg-gray-50 hover:text-gray-900 bg-white group w-full flex items-center pr-2 py-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10'
						)}
					>
						<svg
							className={classNames(
								open ? 'text-gray-400 rotate-90' : 'text-gray-300',
								'mr-2 shrink-0 h-5 w-5 group-hover:text-gray-400 transition-colors ease-in-out duration-150'
							)}
							viewBox="0 0 20 20"
							aria-hidden="true"
						>
							<path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
						</svg>
						Features
					</Disclosure.Button>
					<Disclosure.Panel className="bg-white rounded-b-sm relative">
						{/* Active feature class controls */}
						{activeFeatureClass && (
							<ActiveClassControls
								activeFeatureClass={activeFeatureClass}
								map={map}
							/>
						)}

						{/* Feature classes list */}

						{/* 
              TODO: if there are many classes in the list such that the active 
                    class is not visible then on-load we need to scroll the div
                    so the user can see the active class in the list by default.
            */}
						<div className="max-h-40 overflow-y-auto">
							{Object.values(featureClasses).map((featureClass, index) => (
								<FeatureClass
									key={featureClass.id}
									featureClass={featureClass}
									active={activeFeatureClass === featureClass}
									setActiveFeatureClass={setActiveFeatureClass}
									map={map}
								/>
							))}
						</div>

						{/* Footer toolbar */}
						<FooterToolbar map={map} setFeatureClasses={setFeatureClasses} />
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	)
}

export default Features
