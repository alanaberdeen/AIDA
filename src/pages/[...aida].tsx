import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Viewer from '../components/viewer'

const AIDA = () => {
	const router = useRouter()
	const { asPath, query } = router

	const [imageUrl, setImageUrl] = useState('')
	const [imageName, setImageName] = useState('')

	useEffect(() => {
		setImageName(
			query.aida ? query.aida[query.aida.length - 1] : 'Image not found'
		)
	}, [query, router.isReady])

	useEffect(() => {
		if (router.isReady) setImageUrl(`http://localhost:8000/data${asPath}`)
	}, [asPath])

	return (
		<>
			<Head>
				<title>{`${imageName} - AIDA`}</title>
			</Head>
			{imageUrl && <Viewer imageUrl={imageUrl} />}
		</>
	)
}

export default AIDA
