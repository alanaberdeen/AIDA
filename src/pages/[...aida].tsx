import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Viewer from '../components/viewer'

const AIDA = () => {
	const router = useRouter()
	const { asPath, query } = router

	const [imageUrl, setImageUrl] = useState('')
	const [imageName, setImageName] = useState('')

	const [annotationData, setAnnotationData] = useState(null)
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
					// TODO: load project
				} // Otherwise we assume we are loading an image with a corresponding
				// .json annotation data in the same location.
				else {
					setImageUrl(`http://localhost:8000/data${asPath}`)

					const annotationPath = asPath.split('.')[0] + '.json'
					const response = await fetch(
						`http://localhost:8000/data${annotationPath}`
					)
					const responseJson = await response.json()

					// TODO: parse schema and validate.
					//       show errors if invalid.
					setAnnotationData(responseJson)

					setIsLoading(false)
				}
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
