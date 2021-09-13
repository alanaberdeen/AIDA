import { useState, useEffect } from 'react'

import VectorLayer from "ol/layer/Vector";
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry'

import Slider from '../../../interaction/Slider'

// Manage annotation layers
const ActiveLayerControls = (props: { layer: VectorLayer<VectorSource<Geometry>> }) => {
  const { layer } = props;

  // Opacity controls 
  const handleOpacityChange = (value: [number] | number) => {
    const newOpacity = typeof value === 'number' ? value : value[0]
    layer.setOpacity(newOpacity)
  }

  const [opacity, setOpacity] = useState(layer.getOpacity())

  // Listen to opacity changes (the opacity of this layer may also be changed
  // by visibility toggle button). Do inside a useEffect so that we can return
  // a cleanup function to remove the listener and avoid a memory leak.
  useEffect(() => {
    const listener = () => { setOpacity(layer.getOpacity()) }
    layer.on('change:opacity', listener);
    return () => { layer.un('change:opacity', listener) }
  }, [layer])

  return (
    <div className="border-b border-gray-200">
      {/* Opacity slider */}
      <Slider
        minValue={0}
        maxValue={1}
        step={0.01}
        aria-label={`Layer ${layer.get('id')} opacity`}
        value={[opacity]}
        onChange={handleOpacityChange}
        formatOptions={{style: 'percent'}}
      />      
    </div>
  );
};

export default ActiveLayerControls;
