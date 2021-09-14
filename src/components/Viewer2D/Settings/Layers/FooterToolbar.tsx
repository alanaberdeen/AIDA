import { useState, useEffect } from 'react'

import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry'

import { PlusSmIcon } from '@heroicons/react/solid';

// Manage annotation layers
const FooterToolbar = (props: {
  activeLayer: VectorLayer<VectorSource<Geometry>>
  map: Map
}) => {
  const { activeLayer, map } = props;

  const addNewLayer = () => {
    const layers = map.getLayers()
    const annotationLayers = layers.getArray().filter((layer) => layer.get("type") === "annotation");
    const newLayerId = `layer ${annotationLayers.length + 1}`

    const newLayer = new VectorLayer({
      source: new VectorSource({ wrapX: false })
    });
    newLayer.set('id', newLayerId)
    newLayer.set('type', 'annotation')

    map.addLayer(newLayer);
  }

  return (
    <div className="border-t border-gray-200 flex justify-end">
      <button
        type="button"
        className="inline-flex items-center m-1 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={addNewLayer}
        title="Add new layer"
      >
        <PlusSmIcon className="h-4 w-4" aria-hidden="true"/>
      </button>
    </div>
  );
};

export default FooterToolbar;
