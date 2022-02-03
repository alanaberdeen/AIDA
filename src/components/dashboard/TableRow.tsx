import { useRouter } from 'next/router'

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

interface Node {
	name: string
	path: string
	type: 'directory' | 'file'
	isOpen: boolean
	children: Node[]
	ext: string
}

const TableRow = (props: {
	node: Node
	handleOpenDirectory: (node: Node) => void
}) => {
	const { node, handleOpenDirectory } = props

	const router = useRouter()

	return (
		<div>
			<div
				key={node.name}
				className="w-full flex align-middle hover:bg-gray-100 cursor-pointer"
				onClick={() => {
					if (node.type === 'directory') handleOpenDirectory(node)
					else router.push(node.path)
				}}
			>
				{/* Open triangle */}
				<div className="py-2 mr-2 h-5 w-5 ">
					{node.type === 'directory' ? (
						<svg
							className={classNames(
								node.isOpen ? 'text-gray-400 rotate-90' : 'text-gray-300',
								'flex-shrink-0 transform '
							)}
							viewBox="0 0 20 20"
							aria-hidden="true"
						>
							<path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
						</svg>
					) : null}
				</div>

				{/* Icon */}
				<div className="py-2 whitespace-nowrap text-sm">{node.name}</div>
			</div>
			<div className="border-l ml-2">
				{node.isOpen && node.children.length > 0
					? node.children.map((child) => (
							<div key={child.name} className="pl-4">
								<TableRow
									node={child}
									handleOpenDirectory={handleOpenDirectory}
								/>
							</div>
					  ))
					: null}
			</div>
		</div>
	)
}

export default TableRow
