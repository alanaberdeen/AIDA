/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon } from '@heroicons/react/solid'

import Link from 'next/link'

export default function Menu() {
	return (
		<Popover className="relative">
			{({ open }) => (
				<>
					<Popover.Button className="p-2 mb-2 group shadow bg-teal-600 text-white rounded-md inline-flex items-center text-base font-medium hover:bg-teal-500 focus:outline-none focus:ring-2 ring-inset focus:ring-teal-500">
						<MenuIcon className="h-4 w-4" aria-hidden="true" />
					</Popover.Button>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-200"
						enterFrom="opacity-0 translate-y-1"
						enterTo="opacity-100 translate-y-0"
						leave="transition ease-in duration-150"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 translate-y-1"
					>
						<Popover.Panel className="absolute -mt-8 z-10 transform translate-x-10 md:translate-x-12 px-2 w-screen max-w-xs sm:px-0">
							<div className="rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
								<div className="relative grid bg-white">
									<Link href="/local">
										<a className="px-8 py-1 block transition ease-in-out duration-150 hover:bg-teal-700 hover:text-white">
											Back to dashboard
										</a>
									</Link>
									<Link href="/local">
										<a className="px-8 py-1 block transition ease-in-out duration-150 hover:bg-teal-700 hover:text-white">
											Export JSON
										</a>
									</Link>
									<Link href="/local">
										<a className="px-8 py-1 block transition ease-in-out duration-150 hover:bg-teal-700 hover:text-white">
											Github
										</a>
									</Link>
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	)
}
