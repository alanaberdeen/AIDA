import Map from 'ol/Map'
import { PlusSmIcon } from '@heroicons/react/solid'

// Types
import { IFeatureClass } from './types'

// Manage annotation layers
const FooterToolbar = (props: {
	map: Map
	setFeatureClasses: (featureClasses: IFeatureClass[]) => void
}) => {
	const { map, setFeatureClasses } = props

	const isFeatureClassWithName = (name: string) => {
		const featureClasses: { [key: string]: IFeatureClass } =
			map.get('featureClasses')
		const sameNameClass = Object.values(featureClasses).find(
			(featureClass) => featureClass.name === name
		)
		if (sameNameClass !== undefined) return true
		else return false
	}

	const addFeatureClass = () => {
		const featureClasses = map.get('featureClasses')
		let newId = Object.keys(featureClasses).length + 1

		// Find the next free layer name
		while (isFeatureClassWithName(`Feature ${newId}`)) newId += 1

		const newFeatureName = `Feature ${newId}`
		featureClasses[newId] = {
			id: newId,
			name: newFeatureName,
			description: `Feature ${newId} class.`,
			style: {
				stroke: {
					color: [51, 153, 204],
					width: 1.25,
				},
				fill: {
					color: [255, 255, 255, 0.4],
				},
			},
		}

		console.log(featureClasses)
		map.set('featureClasses', featureClasses)
		setFeatureClasses({ ...featureClasses })
	}

	return (
		<div className="border-t border-gray-100 flex justify-end">
			<button
				type="button"
				className="inline-flex items-center m-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
				onClick={addFeatureClass}
				title="Add new feature class"
			>
				<PlusSmIcon className="h-4 w-4" aria-hidden="true" />
			</button>
		</div>
	)
}

export default FooterToolbar
