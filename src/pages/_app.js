import 'tailwindcss/tailwind.css'
import './overview.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>Demo - AIDA</title>
			</Head>
			<Component {...pageProps} />
		</>
	)
}

export default MyApp
