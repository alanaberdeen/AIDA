import { useEffect, useRef } from 'react'
import { HomeIcon, SearchIcon } from '@heroicons/react/solid'

import useMemoryState from '../../lib/hooks/UseMemoryState'

import TableRow from './TableRow'

import config from '../../../aida.config'

interface Node {
	name: string
	path: string
	type: 'directory' | 'file'
	isOpen: boolean
	children: Node[]
	ext: string
}

// API call to local server to check for images and projects at a specific path
const getItemsAtPath = async (path: string) => {
	try {
		const host = `http://${window.location.hostname}:${config.server.port}`

		const res = await fetch(`${host}/getItemsAtPath`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ path }),
		})

		return res.json()
	} catch (error) {
		console.log(error)
	}
}

const Dashboard = () => {
	// create a ref to store the textInput DOM element
	const searchInput = useRef(null)

	// Store the dashboard tree state in a memory hook so that it can be retained
	// on component mount/unmount
	const [tree, setTree] = useMemoryState('tree', [])
	const [breadcrumbs, setBreadcrumbs] = useMemoryState('breadcrumbs', [])

	// Get default directory structure
	useEffect(() => {
		;(async () => {
			if (tree.length === 0) {
				const tree = await getItemsAtPath('/')
				setTree(tree)
			}
		})()
	}, [tree.length, setTree])

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'k' && e.ctrlKey) {
				e.preventDefault()
				if (searchInput.current) (searchInput.current as HTMLElement).focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	})

	// Open directory callback
	const handleOpenDirectory = async (node: Node) => {
		node.isOpen = !node.isOpen
		node.children = await getItemsAtPath(node.path)
		setTree([...tree])
	}

	return (
		<div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
			{/* Search */}
			<div className="flex-1 flex items-center justify-center">
				<div className="w-full">
					<label htmlFor="search" className="sr-only">
						Search
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<SearchIcon
								className="h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</div>
						<input
							id="search"
							name="search"
							className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
							placeholder="Search"
							type="search"
							ref={searchInput}
						/>
						<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 text-sm">
							Ctrl+k
						</div>
					</div>
				</div>
			</div>

			{/* Breadcrumbs */}
			<nav className="flex py-8" aria-label="Breadcrumb">
				<ol role="list" className="flex items-center space-x-4">
					<li>
						<div>
							<a href="#" className="text-gray-400 hover:text-gray-500">
								<HomeIcon
									className="flex-shrink-0 h-5 w-5"
									aria-hidden="true"
								/>
								<span className="sr-only">Home</span>
							</a>
						</div>
					</li>
					{breadcrumbs.map((directory: string) => (
						<li key={directory}>
							<div className="flex items-center">
								<svg
									className="flex-shrink-0 h-5 w-5 text-gray-300"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-hidden="true"
								>
									<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
								</svg>
								<a className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
									{directory}
								</a>
							</div>
						</li>
					))}
				</ol>
			</nav>

			{/* Tree */}
			<div className="flex flex-col">
				<div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
						<div className="min-w-full">
							{tree.map((node: Node) => (
								<TableRow
									key={node.name}
									node={node}
									handleOpenDirectory={handleOpenDirectory}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
