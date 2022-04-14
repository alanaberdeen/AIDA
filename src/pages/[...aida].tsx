import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Viewer from '../components/viewer'

// Config
import config from '../../aida.config'

// Types
import { Annotation } from '../types/annotation'

// Initial default template for new annotation data
const defaultAnnotation: Annotation = {
	header: {
		schemaVersion: '2.0',
		timestamp: Date.now(),
	},
	layers: [
		{
			id: 'Layer 1',
			features: [],
		},
	],
	classes: [
		{
			id: 0,
			name: 'Default class',
			style: {
				stroke: {
					color: [51, 153, 204, 1],
					width: 1.25,
				},
				fill: {
					color: [255, 255, 255, 0.4],
				},
			},
		},
	],
}

const AIDA = () => {
	const router = useRouter()
	const { asPath, query } = router

	const [imageUrl, setImageUrl] = useState('')
	const [imageName, setImageName] = useState('')
	const [imageExt, setImageExt] = useState('dzi')

	const [annotationData, setAnnotationData] = useState(defaultAnnotation)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setImageName(
			query.aida ? query.aida[query.aida.length - 1] : 'Image not found'
		)
	}, [query, router.isReady])

	useEffect(() => {
		;(async () => {
			if (router.isReady) {
				const dataHost = `http://${window.location.hostname}:${config.server.port}/data`
				const IIIFHost = `http://${window.location.hostname}:${config.IIIF.port}/iiif/2`

				// We assume if the path ends in .json then we are loading an AIDA
				// project which specific image and annotation path as object properties.
				if (asPath.endsWith('.json')) {
					const projectResponse = await fetch(`${dataHost}${asPath}`)

					if (projectResponse.ok) {
						const projectResponseJson = await projectResponse.json()

						if (
							projectResponseJson.image.endsWith('.tiff') ||
							projectResponseJson.image.endsWith('.tif')
						) {
							setImageUrl(`${IIIFHost}${projectResponseJson.image}`)
						} else {
							setImageUrl(`${dataHost}/${projectResponseJson.image}`)
						}

						setImageExt(projectResponseJson.image.split('.')[1])

						// Try to load annotation data
						try {
							const response = await fetch(
								`${dataHost}/${projectResponseJson.annotation}`
							)

							if (response.ok) {
								const responseJson = await response.json()

								// TODO: parse schema and validate.
								//       show errors if invalid.
								setAnnotationData(responseJson)
							}
						} catch (error) {
							console.error(error)
						}
					}
				} // Otherwise we assume we are loading an image with a corresponding
				// .json annotation data in the same location.
				else {
					if (asPath.endsWith('.tiff') || asPath.endsWith('.tif')) {
						setImageUrl(`${IIIFHost}${asPath}`)
					} else {
						setImageUrl(`${dataHost}${asPath}`)
					}

					setImageExt(asPath.split('.')[1])

					// Try to load annotation data
					try {
						const annotationPath = asPath.replace(/\.[^.]+$/, '.json')
						const response = await fetch(`${dataHost}${annotationPath}`)

						if (response.ok) {
							const responseJson = await response.json()

							// TODO: parse schema and validate.
							//       show errors if invalid.
							setAnnotationData(responseJson)
						}
					} catch (error) {
						console.error(error)
					}
				}

				setIsLoading(false)
			}
		})()
	}, [asPath, router.isReady])

	return (
		<>
			<Head>
				<title>{`${imageName} - AIDA`}</title>
			</Head>
			{!isLoading && (
				<Viewer
					imageUrl={imageUrl}
					annotationData={annotationData}
					imageExt={imageExt}
				/>
			)}
		</>
	)
}

export default AIDA
