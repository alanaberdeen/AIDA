import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Dashboard from '../components/dashboard'

export default function Local() {
	const router = useRouter()

	const [isLoading, setIsLoading] = useState(true)
	const [serverIsActive, setServerIsActive] = useState(false)

	// Check if local server is running
	useEffect(() => {
		;(async () => {
			try {
				// Default port for localServer is 8000
				// Checking by ping... perhaps not the best way?
				// TODO: handle the case the server is running on a remote machine
				//       and being accessed over the local network.
				await fetch('http://localhost:8000/ping')
				setIsLoading(false)
				setServerIsActive(true)
			} catch (error) {
				setIsLoading(false)
				setServerIsActive(false)
				console.error(error)
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
						{/* Loading spinner */}
						{isLoading && (
							<div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 h-72 justify-center flex items-center">
								<svg
									className="animate-spin h-8 w-8 text-teal-700"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
							</div>
						)}

						{/* Dashboard */}
						{!isLoading && serverIsActive && <Dashboard />}

						{/* Error, failed to load dashboard */}
						{!isLoading && !serverIsActive && (
							<div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 h-72 justify-center flex items-center flex-col">
								<p>
									Failed to reach server... are you running a local image
									server?
								</p>
								<p className="pt-2">
									See{' '}
									<a
										href="https://github.com/alanaberdeen/AIDA#run-locally"
										className="text-teal-800 hover:underline"
									>
										the Github docs
									</a>{' '}
									for details.
								</p>
							</div>
						)}
					</div>
				</main>
			</div>
		</>
	)
}
