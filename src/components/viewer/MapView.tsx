import Map from 'ol/Map'
import { useEffect, useRef } from 'react'

const MapView = (props: { map: Map }) => {
	const { map } = props

	// Create a reference for this view, useful in cases with multiple views.
	const viewEl = useRef<HTMLDivElement>(null)

	// Target map to HTML element.
	// Need access to DOM element to do this so put inside a useEffect to run
	// after render.
	useEffect(() => {
		if (viewEl.current) map.setTarget(viewEl.current)
	}, [map])

	return <div className="flex flex-grow" ref={viewEl} />
}

export default MapView
