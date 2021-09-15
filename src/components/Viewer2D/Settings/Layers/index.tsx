import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";

import Map from "ol/Map";

import Layer from "./Layer";
import ActiveLayerControls from "./ActiveLayerControls";
import FooterToolbar from "./FooterToolbar";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Manage annotation layers, make adjustments such as opacity, etc.
const Layers = (props: { map: Map }) => {
  const { map } = props;

  const [layers, setLayers] = useState([]);
  const [activeLayer, setActiveLayer] = useState(map.getLayers().get('active').layer);

  // Get annotation layers from map
  useEffect(() => {
    const layers = map.getLayers();
    const annotationLayers = layers
      .getArray()
      .filter((layer) => layer.get("type") === "annotation");
    setLayers(annotationLayers);

    // Set active layer, add listener to update active layer on change
    setActiveLayer(layers.get("active").layer);
    const onActiveLayerChange = () => {
      setActiveLayer(layers.get("active").layer);
    };
    layers.on("propertychange", onActiveLayerChange);

    // Add a listener to update layers state when collection changes
    const onLayersLengthChange = () => {
      setLayers(
        layers.getArray().filter((layer) => layer.get("type") === "annotation")
      );

      // Update active layer (to the layer above) if the currently active layer
      // was deleted and therefore is no longer in the collection. Without this
      // new features will still be applied to the old layer and not visible.
      if (!layers.getArray().includes(activeLayer)) {
        const index = layers.get('active').index
        const newActiveLayer = layers.item(index)
        layers.set('active', { layer: newActiveLayer, index: index })
      }
    };
    layers.on("change:length", onLayersLengthChange);

    // Return a cleanup function to remove the listeners on component unmount
    return () => {
      layers.un("change:length", onLayersLengthChange);
      layers.un("propertychange", onActiveLayerChange);
    };
  }, [map]);

  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={classNames(
              open ? "rounded-t-sm border-b-2" : "rounded-sm border-b-0",
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
          <Disclosure.Panel className="bg-white rounded-b-sm">
            {/* Active layer tab controls */}
            {activeLayer && <ActiveLayerControls activeLayer={activeLayer} />}

            {/* Layers list */}

            {/* 
              TODO: if there are many layers in the list such that the active 
                    layer is not visible then on-load we need to scroll the div
                    so the user can see the active layer in the list by default.
            */}
            <div className="max-h-40 overflow-y-auto">
              {layers.map((layer, index) => (
                <Layer
                  key={index}
                  layer={layer}
                  index={index}
                  active={activeLayer === layer}
                  map={map}
                />
              ))}
            </div>

            {/* Footer toolbar */}
            <FooterToolbar map={map} />
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Layers;
