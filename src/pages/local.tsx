import { useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Dashboard from '../components/dashboard'

export default function Local() {
	const router = useRouter()

	// Check if local server is running
	useEffect(() => {
		;(async () => {
			try {
				// Default port for localServer is 8000
				// Checking by ping... perhaps not the best way?
				// TODO: handle the case the server is running on a remote machine
				//       and being accessed over the local network.
				await fetch('http://localhost:8000/ping')
			} catch (error) {
				console.log(error)
			}
		})()
	})

	// Prefetch the [...path] page as we can assume it's likely the user will
	// navigate there when they open an image
	useEffect(() => {
		router.prefetch('/[...aida]')
	})

	return (
		<>
			<Head>
				<title>Local Dashboard - AIDA</title>
			</Head>
			<div className="min-h-full">
				<div className="bg-teal-700 pb-32">
					<nav className="bg-teal-700 border-b border-teal-300 border-opacity-25 lg:border-none">
						<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
							<div className="relative h-16 flex items-center justify-between lg:border-b lg:border-indigo-400 lg:border-opacity-25">
								<div className="px-2 flex items-center lg:px-0">
									<div className="flex-shrink-0 text-white text-4xl">
										<Link href="/">AIDA</Link>
									</div>
								</div>
							</div>
						</div>
					</nav>
					<header className="py-10">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<h1 className="text-3xl font-bold text-white">Dashboard</h1>
						</div>
					</header>
				</div>

				<main className="-mt-32">
					<div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
						<Dashboard />
					</div>
				</main>
			</div>
		</>
	)
}
