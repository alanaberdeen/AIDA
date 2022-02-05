import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Viewer from '../components/viewer'

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
					color: [51, 153, 204],
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
				// We assume if the path ends in .json then we are loading an AIDA project
				if (asPath.endsWith('.json')) {
					const projectResponse = await fetch(
						`http://localhost:8000/data${asPath}`
					)

					if (projectResponse.ok) {
						const projectResponseJson = await projectResponse.json()
						console.log(projectResponseJson)

						setImageUrl(
							`http://localhost:8000/data/${projectResponseJson.image}`
						)

						// Try to load annotation data
						try {
							const response = await fetch(
								`http://localhost:8000/data/${projectResponseJson.annotation}`
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
					setImageUrl(`http://localhost:8000/data${asPath}`)

					// Try to load annotation data
					try {
						const annotationPath = asPath.split('.')[0] + '.aida'
						const response = await fetch(
							`http://localhost:8000/data${annotationPath}`
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

				setIsLoading(false)
			}
		})()
	}, [asPath])

	return (
		<>
			<Head>
				<title>{`${imageName} - AIDA`}</title>
			</Head>
			{!isLoading && (
				<Viewer imageUrl={imageUrl} annotationData={annotationData} />
			)}
		</>
	)
}

export default AIDA
