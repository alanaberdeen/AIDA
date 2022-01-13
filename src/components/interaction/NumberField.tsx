// Adapted from:
// https://react-spectrum.adobe.com/react-aria/useNumberField.html

import { useNumberFieldState } from '@react-stately/numberfield'
import { useLocale } from '@react-aria/i18n'
import { useButton } from '@react-aria/button'
import { useNumberField } from '@react-aria/numberfield'

import { useRef } from 'react'

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'

const NumberField = (props) => {
	const { locale } = useLocale()
	const state = useNumberFieldState({ ...props, locale })
	const inputRef = useRef()
	const incrementRef = useRef()
	const decrementRef = useRef()

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') state.commit()
	}

	const {
		labelProps,
		groupProps,
		inputProps,
		incrementButtonProps,
		decrementButtonProps,
	} = useNumberField({ ...props, onKeyDown: handleKeyDown }, state, inputRef)

	const { buttonProps: incrementProps } = useButton(
		incrementButtonProps,
		incrementRef
	)
	const { buttonProps: decrementProps } = useButton(
		decrementButtonProps,
		decrementRef
	)

	return (
		<div>
			{props.label && (
				<label
					className="block text-sm font-medium text-gray-700"
					{...labelProps}
					htmlFor={inputRef.current}
				>
					{props.label}
				</label>
			)}
			<div
				{...groupProps}
				className={`${
					props.label ? 'mt-1' : ''
				} relative rounded-md shadow-sm flex`}
			>
				<input
					type="number"
					{...inputProps}
					ref={inputRef}
					id={inputRef.current}
					className="pl-1 focus:ring-blue-500 w-full focus:border-blue-500 min-width-0 text-sm border border-gray-300 rounded-l-md"
				/>

				<div className="flex flex-col border border-gray-300 rounded-r-md">
					<button
						className="-ml-px relative inline-flex items-center px-1 text-sm font-medium rounded-r-md rounded-b-none text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
						{...incrementProps}
						ref={incrementRef}
					>
						<ChevronUpIcon className="h-3 w-3" aria-hidden="true" />
					</button>
					<button
						className="-ml-px relative inline-flex items-center px-1 text-sm font-medium rounded-r-md rounded-t-none text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
						{...decrementProps}
						ref={decrementRef}
					>
						<ChevronDownIcon className="h-3 w-3" aria-hidden="true" />
					</button>
				</div>
			</div>
		</div>
	)
}

export default NumberField
