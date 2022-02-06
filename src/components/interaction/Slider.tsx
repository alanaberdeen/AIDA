// Adapted from https://react-spectrum.adobe.com/react-aria/useSlider.html

import { useSliderState } from '@react-stately/slider'
import { useFocusRing } from '@react-aria/focus'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import { mergeProps } from '@react-aria/utils'
import { useNumberFormatter } from '@react-aria/i18n'
import { useSlider, useSliderThumb } from '@react-aria/slider'

import { useRef } from 'react'

import NumberField from './NumberField'

const Slider = (props) => {
	const trackRef = useRef(null)
	const numberFormatter = useNumberFormatter(props.formatOptions)
	const state = useSliderState({ ...props, numberFormatter })
	const { groupProps, trackProps } = useSlider(props, state, trackRef)

	return (
		<div {...groupProps} className="w-full p-2" style={{ touchAction: 'none' }}>
			{/* Create a flex container for the label and output element. */}
			{/* <div className="flex self-stretch justify-between text-sm text-gray-700">
        {props.label && <label {...labelProps}>{props.label}</label>}
        <output {...outputProps}>
          {state.getThumbValueLabel(0)}
        </output>
      </div> */}

			{/* The track element holds the visible track line and the thumb. */}
			<div className="w-full pl-2 flex items-center">
				<div {...trackProps} ref={trackRef} className="relative h-4 flex-1">
					<div
						className="absolute bg-gray-500 top-2 w-full -translate-y-1/2 flex-1"
						style={{ height: 2 }}
					/>
					<Thumb index={0} state={state} trackRef={trackRef} />
				</div>

				<div className="ml-3 text-sm w-16 text-gray-700 shrink">
					<NumberField {...props} />
				</div>
			</div>
		</div>
	)
}

const Thumb = (props) => {
	const { state, trackRef, index } = props
	const inputRef = useRef(null)
	const { thumbProps, inputProps } = useSliderThumb(
		{
			index,
			trackRef,
			inputRef,
		},
		state
	)

	const { focusProps, isFocusVisible } = useFocusRing()
	return (
		<div
			className="absolute top-2 -translate-x-1/2 -translate-y-1/2"
			style={{ left: `${state.getThumbPercent(index) * 100}%` }}
		>
			<div
				{...thumbProps}
				className="w-3 h-3 rounded-full"
				style={{
					backgroundColor: isFocusVisible
						? '#1E40AF' // blue-800
						: state.isThumbDragging(index)
						? '#374151' // gray-700
						: '#6B7280', // gray-500
				}}
			>
				<VisuallyHidden>
					<input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
				</VisuallyHidden>
			</div>
		</div>
	)
}

export default Slider
