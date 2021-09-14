import { useState, useRef, useEffect, SyntheticEvent } from 'react'

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

  // Utilities for editing layer name
  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef(null);
  const [layerName, setLayerName] = useState(layer.get('id'))
  const handleNameChange = (e: SyntheticEvent) => {
    const newName = (e.target as HTMLInputElement).value;
    setLayerName(newName);
    layer.set('id', newName);
  }

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
        className={`${isEditingName ? 'w-full m-1' : 'w-0'} block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300`}
        placeholder={layerName}
        onBlur={() => { setIsEditingName(false) }}
        value={layerName}
        onChange={handleNameChange}
        onKeyUp={(e) => {if (e.key === 'Enter') { nameInputRef.current.blur() }}}
      />
      
      <button
        type="button"
        className={`${active ? 'text-blue-900 bg-gray-50 font-medium' : 'text-gray-700 bg-white' } ${isEditingName ? 'w-0' : 'w-full m-1 '} inline-flex truncate items-center w-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        onClick={() => setLayerActive(layer)}
        onDoubleClick={() => {
          setIsEditingName(true)
          nameInputRef.current.focus()
        }}
      >
        {layerName}
      </button> 
      
    </div>
  );
};

export default Layer;
