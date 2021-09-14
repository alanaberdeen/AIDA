import { useState, useRef, useEffect } from 'react'

import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry'

import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'

// Manage annotation layers
const Layer = (props: {
  layer: VectorLayer<VectorSource<Geometry>>
  active: boolean,
  map: Map
}) => {
  const { layer, active, map } = props;

  const [isVisible, setIsVisible] = useState(layer.getVisible());

  // Toggle opacity
  const opacityCache = useRef(layer.getOpacity());
  const toggleOpacity = () => {
    if (layer.getOpacity() === 0) {
      layer.setOpacity(opacityCache.current);
    } else {
      opacityCache.current = layer.getOpacity();
      layer.setOpacity(0);
    }
  }

  // Attach a listener for opacity changes (the opacity of this layer may also
  // be changed by the activeLayer control slider). Need to do this inside a 
  // useEffect hook so we can return a cleanup function and avoid a memory leak.
  useEffect(() => {
    const listener = () => { setIsVisible(layer.getOpacity() !== 0) }
    layer.on('change:opacity', listener);
    return () => { layer.un('change:opacity', listener) };
  }, [layer])

  // Set layer active 
  const setLayerActive = (layer: VectorLayer<VectorSource<Geometry>>) => {
    map.getLayers().set('activeLayer', layer)
  }

  return (
    <div className={`${active ? '' : ''} flex items-center text-sm`}>
      <button
        type="button"
        className="m-1 inline-flex items-center rounded-full text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
        onClick={toggleOpacity}
      >
        { isVisible ? 
          <EyeIcon className="h-4 w-4" aria-hidden="true" /> :
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        }
      </button>

      <button
        type="button"
        className={`${active ? 'text-blue-900 bg-gray-50 font-medium' : 'text-gray-700 bg-white' } m-1 truncate inline-flex items-center w-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        onClick={() => setLayerActive(layer)}
      >
        {layer.get('id')}
      </button>
    </div>
  );
};

export default Layer;
