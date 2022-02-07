// Adapted from:
// https://react-spectrum.adobe.com/react-aria/useNumberField.html
import { useRef } from 'react'
import { useNumberFieldState } from '@react-stately/numberfield'
import { useLocale } from '@react-aria/i18n'
import { useButton } from '@react-aria/button'
import { useNumberField } from '@react-aria/numberfield'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'

import createSimpleId from '../../lib/utils/createSimpleId'

// Types
import type { KeyboardEvent } from 'react'

const NumberField = (props: { label?: string }) => {
	const { locale } = useLocale()
	const state = useNumberFieldState({ ...props, locale })
	const inputRef = useRef<HTMLInputElement>(null)
	const incrementRef = useRef<HTMLButtonElement>(null)
	const decrementRef = useRef<HTMLButtonElement>(null)

	// Create a unique id for the input
	const id = createSimpleId()

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') state.commit()
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
					htmlFor={id}
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
					id={id}
					className="pl-1 focus:outline-none focus:ring-teal-500 w-full focus:border-teal-500 min-width-0 text-sm border border-gray-300 rounded-l-md"
				/>

				<div className="flex flex-col border border-gray-300 rounded-r-md">
					<button
						className="-ml-px relative inline-flex items-center px-1 text-sm font-medium rounded-r-md rounded-b-none text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
						{...incrementProps}
						ref={incrementRef}
					>
						<ChevronUpIcon className="h-3 w-3" aria-hidden="true" />
					</button>
					<button
						className="-ml-px relative inline-flex items-center px-1 text-sm font-medium rounded-r-md rounded-t-none text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
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
