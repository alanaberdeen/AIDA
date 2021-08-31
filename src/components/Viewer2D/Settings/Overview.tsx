import { useEffect, useRef } from 'react'

import Map from 'ol/Map'
import OverviewMap from 'ol/control/OverviewMap'
import TileLayer from 'ol/layer/Tile'
import Zoomify from 'ol/source/Zoomify'


// Overview shows a high-level overview of the map, indicating the current size
// and position of the viewport.
const Overview = (props: { map: Map }) => {
  const { map } = props

  const overviewEl = useRef(null)

  useEffect(() => {
    const imageLayer = map.getLayers().getArray()
      .find(layer => layer.get('id') === 'image') as TileLayer<Zoomify>
    const imageSource = imageLayer.getSource()

    const overview = new OverviewMap({
      className: 'overview ol-overviewmap',
      collapsible: false,
      layers: [new TileLayer({
        source: imageSource,
      })],
      target: overviewEl.current,
    })
    map.addControl(overview)
  }, [map])


  return (
    <div ref={overviewEl} className="w-full h-32 bg-white"/>
  )
}

export default Overview