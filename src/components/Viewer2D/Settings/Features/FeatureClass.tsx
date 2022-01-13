import { useState, useRef, useEffect, SyntheticEvent } from 'react'

import { Menu, Transition } from '@headlessui/react'

import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry'
import Style from 'ol/style/Style'
import { Color, asArray } from 'ol/color'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'

import ColorPicker from '../../../interaction/ColorPicker'

import { IFeatureClass } from './types';

// Manage annotation layers
const FeatureClass = (props: {
  featureClass: IFeatureClass
  active: boolean,
  map: Map,
  setActiveFeatureClass: (featureClass: IFeatureClass) => void
}) => {
  const { featureClass, active, map, setActiveFeatureClass } = props;

  // Extract color from feature class
  const [strokeColor, setStrokeColor] = useState(featureClass.style.stroke.color)
  const [fillColor, setFillColor] = useState(featureClass.style.fill.color)


  // Utilities for editing layer name
  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef(null);
  const [nameInputValue, setNameInputValue] = useState(featureClass.name);
    
  const handleNameChange = (e: SyntheticEvent) => {
    const newName = (e.target as HTMLInputElement).value;
    setNameInputValue(newName);

    const featureClasses = map.get('featureClasses');
    featureClasses[featureClass.id].name = newName;
    map.set('featureClasses', featureClasses);
  }

  // Reference to the select tool
  const selectTool = map.getInteractions().getArray().find(
    i => i.get('id') === 'select'
  )

  // Opacity controls 
  const handleOpacityChange = (value: [number] | number) => {
    // HACK: opacity changes break when a feature is selected due to the applied
    // style function for selection indicator. The workaround is to first
    // deselect all features then apply the style changes.
    // TODO: find a better way to do this.
    selectTool.getFeatures().clear()

    const newOpacity = typeof value === 'number' ? value : value[0]

    // Get active features
    const annotationLayer = map.getLayers().getArray().find((layer) => layer.get("type") === "annotation") as VectorLayer<VectorSource<Geometry>>
    const annotationSource = annotationLayer.getSource()
    const activeFeatures = annotationSource.getFeatures().filter((feature) => feature.get("class") === featureClass.id)
    
    // There doesn't seem to be a way to set the opacity of feature (or]
    // collection of features) directly. Instead you have to set the color on 
    // the stroke and fill and manually change the alpha value. This is a bit 
    // clunky.
    activeFeatures.forEach((feature) => {
      const currentStyle = feature.getStyle() as Style
      const currentFillColor = asArray(currentStyle.getFill().getColor() as Color)
      const newStroke = currentStyle.getStroke().clone()
      const currentStrokeColor = asArray(currentStyle.getStroke().getColor() as Color)
      newStroke.setColor([...currentStrokeColor.slice(0,3), newOpacity])

      // Set new opacity
      feature.setStyle(new Style({
        fill: new Fill({ color: [...currentFillColor.slice(0,3), newOpacity] }),
        stroke: newStroke
      }))
    })

    featureClass.style.fill.color = [...featureClass.style.fill.color.slice(0,3), newOpacity]
    const previousFeatureClasses = map.get('featureClasses')
    previousFeatureClasses[featureClass.id].style.fill.color = [...featureClass.style.fill.color.slice(0,3), newOpacity]
    map.set('featureClasses', previousFeatureClasses)

    // HACK: change a property on the map to a new value in order to trigger 
    // a listener that will check the opacity value of the active features. 
    // This a work-around because the listener cannot detect change on the 
    // larger nested object.
    map.set('change', Math.random())
  }

  // Utilities for toggling opacity
  const [isVisible, setIsVisible] = useState(featureClass.style.fill.color[3] > 0);
  const opacityCache = useRef(featureClass.style.fill.color[3]);
  const toggleOpacity = () => {
    if (featureClass.style.fill.color[3] === 0) {
      handleOpacityChange(opacityCache.current)
      setIsVisible(true)
    } else {
      opacityCache.current = map.get('featureClasses')[featureClass.id].style.fill.color[3];
      handleOpacityChange(0)
      setIsVisible(false)
    }
  }

  // Utilities for context menu
  const [contextMenuPos, setContextMenuPos] = useState([null, null]);
  const contextMenuRef = useRef(null);
  
  // Attach a listener for opacity changes (the opacity of this class may also
  // be changed by the activeClassControls slider). Need to do this inside a 
  // useEffect hook so we can return a cleanup function and avoid a memory leak.
  useEffect(() => {
    const listener = () => setIsVisible(featureClass.style.fill.color[3] !== 0)
    map.on('propertychange', listener)
    return () => { map.un('propertychange', listener) }
  }, [featureClass])

  // Activate a feature class
  const activateFeatureClass = () => {
    setActiveFeatureClass(featureClass)
    map.set('activeFeatureClass', featureClass.id)
  }

  // On color change update all the styles of the active features.
  const handleColorChange = (
    fill: [number, number, number, number?],
    stroke: [number, number, number, number?]
  ) => {
    // HACK: opacity changes break when a feature is selected due to the applied
    // style function for selection indicator. The workaround is to first
    // deselect all features then apply the style changes.
    // TODO: find a better way to do this.
    selectTool.getFeatures().clear()

    // Get active features
    const annotationLayer = map.getLayers().getArray().find((layer) => layer.get("type") === "annotation") as VectorLayer<VectorSource<Geometry>>
    const annotationSource = annotationLayer.getSource()
    const activeFeatures = annotationSource.getFeatures().filter((feature) => feature.get("class") === featureClass.id)
    
    activeFeatures.forEach((feature) => {
      feature.setStyle(new Style({
        fill: new Fill({ color: fill }),
        stroke: new Stroke({ color: stroke })
      }))
    })

    featureClass.style.fill.color = fill
    featureClass.style.stroke.color = stroke
    const previousFeatureClasses = map.get('featureClasses')
    previousFeatureClasses[featureClass.id].style = featureClass.style
    map.set('featureClasses', previousFeatureClasses)

    setFillColor(fill)
    setStrokeColor(stroke)
  }

  return (  
    <div
      className={`${active ? 'text-blue-900 bg-gray-50' : 'text-gray-700 bg-white' } flex justify-between w-full text-sm`}
      onContextMenu={(e) => {
        e.preventDefault();
        contextMenuRef.current.click();
        setContextMenuPos([e.clientX, e.clientY]);
      }}
    >

      {/* Opacity */}
      <button
        type="button"
        className="m-1 inline-flex items-center text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
        onClick={toggleOpacity}
      >
        { isVisible ? 
          <EyeIcon className="h-4 w-4" aria-hidden="true" /> :
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        }
      </button>

      {/* Color picker */}
      <ColorPicker
        color={{fill: fillColor, stroke: strokeColor }}
        onChange={ handleColorChange }
      />

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
        className={`${isEditingName ? 'w-full m-1' : 'w-0'} block focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 focus:border-blue-500 border-gray-300`}
        placeholder={featureClass.name}
        onBlur={() => { setIsEditingName(false) }}
        value={nameInputValue}
        onChange={handleNameChange}
        onKeyUp={(e) => {if (e.key === 'Enter') { nameInputRef.current.blur() }}}
      />

      <button
        type="button"
        className={`${isEditingName ? 'w-0' : 'w-full m-1'} truncate text-left w-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500`}
        onClick={() => activateFeatureClass()}
        onDoubleClick={() => {
          setIsEditingName(true)
          nameInputRef.current.focus()
        }}
      >
        {featureClass.name}
      </button>



      {/* Context menu */}
      {/*
        This seems like a poor way of doing this - there is likely a better 
        solution. We are using a hidden button to open the context menu. We are
        activating that button via an onContextMenu event (see above). This is 
        because headlessUI do not expose the open state of their menu so we 
        cannot easily create a controlled component. It's a workaround.
      */}
      <Menu>
        <Menu.Button ref={contextMenuRef}/>
          
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="scale-95 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-95 opacity-0"
        >
          <Menu.Items
            className={`absolute w-28 mt-2 origin-top-right -translate-x-full bg-white divide-y divide-gray-100 rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            style={{left: contextMenuPos[0], top: contextMenuPos[1]}}
          >
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    } group flex rounded-sm items-center w-full p-1 text-sm`}
                    // onClick={() => { map.removeLayer(layer) }}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default FeatureClass;