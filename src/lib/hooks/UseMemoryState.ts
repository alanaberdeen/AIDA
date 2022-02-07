// Custom hook to 'memorise' a value between component mount/unmount
// https://stackoverflow.com/questions/31352261/how-to-keep-react-component-state-between-mount-unmount

// A potential problem with this approach is you need to ensure every memorised
// value is stored under a unique key. It might be better to go full-hog and use
// something like Redux?

import { useState } from 'react'

const memoryState: { [key: string]: any } = {}

function useMemoryState(key: string, initialState: any) {
	const [state, setState] = useState(() => {
		const hasMemoryValue = Object.prototype.hasOwnProperty.call(
			memoryState,
			key
		)
		if (hasMemoryValue) {
			return memoryState[key]
		} else {
			return typeof initialState === 'function' ? initialState() : initialState
		}
	})

	function onChange(nextState: any) {
		memoryState[key] = nextState
		setState(nextState)
	}

	return [state, onChange]
}

export default useMemoryState
