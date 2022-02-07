import Head from 'next/head'
import Link from 'next/link'
import { ArrowRightIcon, ServerIcon } from '@heroicons/react/solid'
import { StarIcon, ScaleIcon } from '@heroicons/react/outline'
import { useState, useEffect } from 'react'

export default function Home() {
	const [stars, setStars] = useState(48) // Defaults are updated by API call
	const [forks, setForks] = useState(14)

	// Get number of GitHub stars
	// Be careful not to overload the public API.
	// useEffect(() => {
	//   window
	//     .fetch("https://api.github.com/repos/alanaberdeen/AIDA")
	//     .then((res) => {
	//       return res.json();
	//     })
	//     .then((data) => {
	//       setStars(data.stargazers_count);
	//       setForks(data.forks_count);
	//     });
	// });

	const [isLocalhost, setIsLocalhost] = useState(false)
	useEffect(() => setIsLocalhost(window.location.hostname === 'localhost'), [])

	return (
		<div>
			<Head>
				<title>Annotate Image Data by Assignment - AIDA</title>
			</Head>

			<header className="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
				<div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
					<div>
						<div className="mt-12">
							<div className="mt-6 sm:max-w-xl">
								<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
									Easily annotate high-resolution images in your browser.
								</h1>

								{/* Stats */}
								<div className="mt-6 text-gray-500 flex items-center">
									{/* Github stars */}
									<StarIcon className="h-4 w-4 mr-1" aria-hidden="true" />
									{stars}
									{/* Github forks */}
									<svg className="w-4 h-4 ml-8 mr-1" viewBox="0 0 24 24">
										<path
											fill="currentColor"
											d="M6,2A3,3 0 0,1 9,5C9,6.28 8.19,7.38 7.06,7.81C7.15,8.27 7.39,8.83 8,9.63C9,10.92 11,12.83 12,14.17C13,12.83 15,10.92 16,9.63C16.61,8.83 16.85,8.27 16.94,7.81C15.81,7.38 15,6.28 15,5A3,3 0 0,1 18,2A3,3 0 0,1 21,5C21,6.32 20.14,7.45 18.95,7.85C18.87,8.37 18.64,9 18,9.83C17,11.17 15,13.08 14,14.38C13.39,15.17 13.15,15.73 13.06,16.19C14.19,16.62 15,17.72 15,19A3,3 0 0,1 12,22A3,3 0 0,1 9,19C9,17.72 9.81,16.62 10.94,16.19C10.85,15.73 10.61,15.17 10,14.38C9,13.08 7,11.17 6,9.83C5.36,9 5.13,8.37 5.05,7.85C3.86,7.45 3,6.32 3,5A3,3 0 0,1 6,2M6,4A1,1 0 0,0 5,5A1,1 0 0,0 6,6A1,1 0 0,0 7,5A1,1 0 0,0 6,4M18,4A1,1 0 0,0 17,5A1,1 0 0,0 18,6A1,1 0 0,0 19,5A1,1 0 0,0 18,4M12,18A1,1 0 0,0 11,19A1,1 0 0,0 12,20A1,1 0 0,0 13,19A1,1 0 0,0 12,18Z"
										/>
									</svg>
									{forks}
									{/* License */}
									<ScaleIcon className="h-4 w-4 mr-2 ml-8" aria-hidden="true" />
									MIT License
								</div>

								<p className="mt-6 text-xl text-gray-500">
									An{' '}
									<a
										href="https://github.com/alanaberdeen/AIDA"
										className="hover:underline mx-1"
										target="_blank"
										rel="noreferrer"
									>
										open source
										<svg
											className="w-4 h-4 ml-1 mb-1 inline"
											viewBox="0 0 24 24"
										>
											<path
												fill="currentColor"
												d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
											/>
										</svg>
									</a>{' '}
									web-based annotation tool built for huge deep-zoom images
									&#8211; add image annotation and model review to your
									workflow.
								</p>
							</div>

							<div className="mt-4">
								{isLocalhost ? (
									<Link href="/local">
										<a className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm leading-4 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
											<ServerIcon className="mr-2 h-4 w-4" aria-hidden="true" />
											Local server
											<ArrowRightIcon
												className="ml-2 -mr-0.5 h-4 w-4"
												aria-hidden="true"
											/>
										</a>
									</Link>
								) : (
									<Link href="/demo">
										<a className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm leading-4 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
											Try a demo
											<ArrowRightIcon
												className="ml-2 -mr-0.5 h-4 w-4"
												aria-hidden="true"
											/>
										</a>
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="sm:mx-auto sm:max-w-3xl sm:px-6">
					<div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
						<div className="hidden sm:block">
							<div className="absolute inset-y-0 left-1/2 w-screen bg-gray-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full" />
							<svg
								className="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0"
								width={404}
								height={392}
								fill="none"
								viewBox="0 0 404 392"
							>
								<defs>
									<pattern
										id="837c3e70-6c3a-44e6-8854-cc48c737b659"
										x={0}
										y={0}
										width={20}
										height={20}
										patternUnits="userSpaceOnUse"
									>
										<rect
											x={0}
											y={0}
											width={4}
											height={4}
											className="text-gray-200"
											fill="currentColor"
										/>
									</pattern>
								</defs>
								<rect
									width={404}
									height={392}
									fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
								/>
							</svg>
						</div>
						<div className="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
							<img
								className="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
								src="/images/aida-screenshot.png"
								alt="screenshot of AIDA interface"
							/>
						</div>
					</div>
				</div>
			</header>

			<main className="bg-gray-50 flex justify-center md:mt-20 py-12 md:py-20">
				<div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl mm:pt-16">
					<div className="max-w-prose">
						<h2 className="text-2xl text-gray-900 font-semibold tracking-tight sm:text-3xl">
							The basic idea
						</h2>
						<div className="mt-4 text-gray-600 space-y-6 text-base leading-relaxed">
							<p>
								AIDA brings an open source web-based work-flow to image
								annotation.
							</p>
							<p>
								Currently, in the biomedical imaging space, image annotation is
								largely confined to shrink-wrapped software on a single computer
								with limited interactive capabilities and few, usually closed,
								data formats.
							</p>
							<p>
								AIDA is a web interface that enables distributed teams of
								researchers to directly annotate images with easy to use on
								screen drawing tools. AIDA supports the creation of well defined
								annotation protocols which include a series of images and a
								specific set of annotation tasks.
							</p>
						</div>
					</div>

					<div className="max-w-prose mt-20">
						<h2 className="text-2xl text-gray-900 font-semibold tracking-tight sm:text-3xl">
							How has it been implemented?
						</h2>
						<div className="mt-4 text-gray-600 space-y-6 text-base leading-relaxed">
							<p>
								The user interface is a React Single Page Application built on
								the NextJS framework. The application uses OpenLayers to
								manipulate and annotate high resolution deep-zoom images.
							</p>
						</div>
					</div>

					<div className="max-w-prose mt-20">
						<h2 className="text-2xl text-gray-900 font-semibold tracking-tight sm:text-3xl">
							What&apos;s planned?
						</h2>
						<div className="mt-4 text-gray-600 space-y-6 text-base leading-relaxed">
							<p>
								The software is published as Open Source under the permissive{' '}
								<a
									className="text-teal-600 hover:underline"
									href="https://github.com/alanaberdeen/AIDA/blob/master/LICENSE"
								>
									MIT license
								</a>
								.
							</p>
							<p>
								The next stage of development will be to integrate intelligent
								tools that leverage the power of machine learning techniques. We
								hope to enhance the ability of the user to quickly and
								accurately mark up images through predictive assistance.
							</p>
						</div>
					</div>

					<div className="max-w-prose mt-20">
						<h2 className="text-2xl text-gray-900 font-semibold tracking-tight sm:text-3xl">
							About
						</h2>
						<div className="mt-4 text-gray-600 space-y-6 text-base leading-relaxed">
							<p>
								This is a project of{' '}
								<a
									className="text-teal-600 hover:underline"
									href="https://alanaberdeen.com"
								>
									Alan Aberdeen
								</a>{' '}
								with contributions from{' '}
								<a
									className="text-teal-600 hover:underline"
									href="https://github.com/stefano-malacrino"
								>
									Stefano Malacrino
								</a>
								, Nasullah Khalid Alham and{' '}
								<a
									className="text-teal-600 hover:underline"
									href="https://github.com/rcasero"
								>
									Ramón Casero
								</a>
								. It originated at the Quantitative Biological Imaging Group,
								The University of Oxford.
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
