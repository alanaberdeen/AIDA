import Viewer from '../components/viewer'
import Head from 'next/head'

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

const Demo = () => {
	// Demo uses example image from S3 bucket
	const imageUrl =
		'https://s3-eu-west-1.amazonaws.com/aida-example/SampleKi67.dzi'

	return (
		<>
			<Head>
				<title>Demo - AIDA</title>
			</Head>
			<Viewer
				imageUrl={imageUrl}
				imageExt={'dzi'}
				annotationData={defaultAnnotation}
			/>
		</>
	)
}

export default Demo
