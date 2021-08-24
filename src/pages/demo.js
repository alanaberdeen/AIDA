import Viewer2D from '../components/Viewer2D'

const Demo = () => {
  // Demo uses example image from S3 bucket
  const imageUrl = 'https://s3-eu-west-1.amazonaws.com/aida-example/SampleKi67.dzi'

  return (<Viewer2D imageUrl={imageUrl} />)
}

export default Demo
