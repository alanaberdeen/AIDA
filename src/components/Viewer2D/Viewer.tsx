import Map from 'ol/Map'
import { useEffect, useRef } from 'react'

const Viewer = (props: {map: Map}) => {
  const { map } = props

  // Create a reference for this view, useful in cases with multiple views.
  const viewEl = useRef(null)

  // Target map to HTML element.
  // Need access to DOM element to do this so put inside a useEffect to run 
  // after render.
  useEffect(() => {
    map.setTarget(viewEl.current)
  }, [map])

  return (
    <div
      className='flex flex-grow'
      ref={viewEl}
    />
  )
}

export default Viewer
