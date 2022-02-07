import { Popover, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { ChromePicker } from 'react-color'

interface ColorDetails {
	name: string
	hex: string
	borderColor: string
	bgColor: string
	fill: [number, number, number, number]
	stroke: [number, number, number, number]
}

const templateColors: ColorDetails[] = [
	{
		name: 'Gray',
		hex: '#6b7280',
		borderColor: 'border-gray-500',
		bgColor: 'bg-gray-500',
		fill: [107, 114, 128, 0.3],
		stroke: [107, 114, 128, 1],
	},
	{
		name: 'Red',
		hex: '#ef4444',
		borderColor: 'border-red-500',
		bgColor: 'bg-red-500',
		fill: [239, 68, 68, 0.3],
		stroke: [239, 68, 68, 1],
	},
	{
		name: 'Orange',
		hex: '#f97316',
		borderColor: 'border-orange-500',
		bgColor: 'bg-orange-500',
		fill: [249, 115, 22, 0.3],
		stroke: [249, 115, 22, 1],
	},
	{
		name: 'Yellow',
		hex: '#eab308',
		borderColor: 'border-yellow-500',
		bgColor: 'bg-yellow-500',
		fill: [234, 179, 8, 0.3],
		stroke: [234, 179, 8, 1],
	},
	{
		name: 'Lime',
		hex: '#84cc16',
		borderColor: 'border-lime-500',
		bgColor: 'bg-lime-500',
		fill: [132, 204, 22, 0.3],
		stroke: [132, 204, 22, 1],
	},
	{
		name: 'Green',
		hex: '#22c55e',
		borderColor: 'border-green-500',
		bgColor: 'bg-green-500',
		fill: [34, 197, 94, 0.3],
		stroke: [34, 197, 94, 1],
	},
	{
		name: 'Teal',
		hex: '#14b8a6',
		borderColor: 'border-teal-500',
		bgColor: 'bg-teal-500',
		fill: [20, 184, 166, 0.3],
		stroke: [20, 184, 166, 1],
	},
	{
		name: 'Blue',
		hex: '#3b82f6',
		borderColor: 'border-blue-500',
		bgColor: 'bg-blue-500',
		fill: [59, 130, 246, 0.3],
		stroke: [59, 130, 246, 1],
	},
	{
		name: 'Purple',
		hex: '#a855f7',
		borderColor: 'border-purple-500',
		bgColor: 'bg-purple-500',
		fill: [168, 85, 247, 0.3],
		stroke: [168, 85, 247, 1],
	},
	{
		name: 'Pink',
		hex: '#ec4899',
		borderColor: 'border-pink-500',
		bgColor: 'bg-pink-500',
		fill: [236, 72, 153, 0.3],
		stroke: [236, 72, 153, 1],
	},
]

export default function ColorPicker(props: {
	color: {
		fill: [number, number, number, number]
		stroke: [number, number, number, number]
	}
	onChange: (
		fill: [number, number, number, number],
		stroke: [number, number, number, number]
	) => void
}) {
	const { color, onChange } = props

	// Create dynamic inline style objects based on color provided as props
	const [buttonStyle, setButtonStyle] = useState({
		backgroundColor: `rgba(${color.fill.join(',')})`,
		borderColor: `rgba(${color.stroke.join(',')})`,
	})

	const [strokeStyle, setStrokeStyle] = useState({
		borderColor: `rgba(${color.stroke.join(',')})`,
	})

	const [fillStyle, setFillStyle] = useState({
		backgroundColor: `rgba(${color.fill.join(',')})`,
	})

	useEffect(() => {
		setButtonStyle({
			backgroundColor: `rgba(${color.fill.join(',')})`,
			borderColor: `rgba(${color.stroke.join(',')})`,
		})

		setStrokeStyle({
			borderColor: `rgba(${color.stroke.join(',')})`,
		})

		setFillStyle({
			backgroundColor: `rgba(${color.fill.join(',')})`,
		})
	}, [color])

	const onColorClick = (color: ColorDetails) => {
		onChange(color.fill, color.stroke)
	}

	return (
		<Popover className="m-1">
			{({ open }) => (
				<>
					<Popover.Button
						style={buttonStyle}
						className={`w-4 h-4 rounded-sm border-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-opacity-75`}
					/>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-200"
						enterFrom="opacity-0 translate-y-1"
						enterTo="opacity-100 translate-y-0"
						leave="transition ease-in duration-150"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 translate-y-1"
					>
						<Popover.Panel className="absolute z-10 w-48 p-2 transform -translate-x-56 -translate-y-1/2">
							<div className="overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
								<div className="bg-white p-2">
									<div className="text-sm font-medium text-gray-800">
										{' '}
										Templates{' '}
									</div>
									<div className="grid grid-cols-5 mt-2">
										{templateColors.map((item) => (
											<div
												className={`${
													color.fill === item.fill ? 'bg-gray-200' : ''
												} rounded-sm flex justify-center align-middle`}
												key={item.hex}
											>
												<button
													className={`m-1 border-4 ${item.borderColor} ${item.bgColor} bg-opacity-30 w-5 h-5 rounded-sm`}
													onClick={() => onColorClick(item)}
												/>
											</div>
										))}
									</div>
								</div>

								<div className=" p-2 bg-white border-t-gray-50">
									<div className="relative text-sm font-medium text-gray-800">
										{' '}
										Custom{' '}
									</div>
									<Popover>
										<Popover.Button className="w-full text-sm text-gray-500 flex my-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-opacity-75">
											<span className="w-1/3"> Stroke </span>
											<div
												style={strokeStyle}
												className={`border-4 w-5 h-5 rounded-sm`}
											/>
										</Popover.Button>

										<Transition
											enter="transition duration-100 ease-out"
											enterFrom="transform scale-95 opacity-0"
											enterTo="transform scale-100 opacity-100"
											leave="transition duration-75 ease-out"
											leaveFrom="transform scale-100 opacity-100"
											leaveTo="transform scale-95 opacity-0"
										>
											<Popover.Panel className="absolute z-10 transform -translate-x-full -mx-4 -translate-y-1/2">
												<ChromePicker
													color={{
														r: color.stroke[0],
														g: color.stroke[1],
														b: color.stroke[2],
														a: color.stroke[3],
													}}
													onChange={(newColor) => {
														onChange(color.fill, [
															newColor.rgb.r,
															newColor.rgb.g,
															newColor.rgb.b,
															newColor.rgb.a || 1,
														])
													}}
												/>
											</Popover.Panel>
										</Transition>
									</Popover>

									<Popover>
										<Popover.Button className="w-full text-sm text-gray-500 flex my-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-opacity-75">
											<span className="w-1/3"> Fill </span>
											<div style={fillStyle} className={`w-5 h-5 rounded-sm`} />
										</Popover.Button>

										<Transition
											enter="transition duration-100 ease-out"
											enterFrom="transform scale-95 opacity-0"
											enterTo="transform scale-100 opacity-100"
											leave="transition duration-75 ease-out"
											leaveFrom="transform scale-100 opacity-100"
											leaveTo="transform scale-95 opacity-0"
										>
											<Popover.Panel className="absolute z-10 transform -translate-x-full -mx-4 -translate-y-1/2">
												<ChromePicker
													color={{
														r: color.fill[0],
														g: color.fill[1],
														b: color.fill[2],
														a: color.fill[3],
													}}
													onChange={(newColor) => {
														onChange(
															[
																newColor.rgb.r,
																newColor.rgb.g,
																newColor.rgb.b,
																newColor.rgb.a || 1,
															],
															color.stroke
														)
													}}
												/>
											</Popover.Panel>
										</Transition>
									</Popover>
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	)
}
