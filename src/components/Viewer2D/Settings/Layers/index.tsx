import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";

import Map from "ol/Map";

import Layer from "./Layer";
import ActiveLayerControls from "./ActiveLayerControls";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Manage annotation layers, make adjustments such as opacity, etc.
const Layers = (props: { map: Map }) => {
  const { map } = props;

  const [layers, setLayers] = useState([]);
  const [activeLayer, setActiveLayer] = useState(null)

  // Get annotation layers from map
  useEffect(() => {
    const layers = map.getLayers();
    const annotationLayers = layers.getArray().filter((layer) => layer.get("type") === "annotation");
    setLayers(annotationLayers);

    // Set the first layer to be initially active by default
    setActiveLayer(annotationLayers[0])

    // Add a listener to update layers state when collection changes
    const listener = () => {
      setLayers(layers.getArray().filter((layer) => layer.get("type") === "annotation")     );
    }
    layers.on("change", listener);

    // Return a cleanup function to remove the listener on component unmount
    return () => { layers.un("change", listener); }
  }, [map]);

  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={classNames(
              open ? "rounded-t-md border-b-2" : "rounded-md border-b-0",
              "text-gray-700 hover:bg-gray-50 hover:text-gray-900 bg-white group w-full flex items-center pr-2 py-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10"
            )}
          >
            <svg
              className={classNames(
                open ? "text-gray-400 rotate-90" : "text-gray-300",
                "mr-2 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
              )}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
            </svg>
            Layers
          </Disclosure.Button>
          <Disclosure.Panel className="bg-white rounded-b-md">
            {/* Active layer tab controls */}
            {activeLayer && <ActiveLayerControls layer={activeLayer}/>}

            {/* Layers list */}
            {layers.map((layer, index) => (
              <Layer layer={layer} key={index} active={activeLayer === layer}/>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Layers;
