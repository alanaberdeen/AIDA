interface Style {
	stroke: {
		color: [red: number, green: number, blue: number, alpha: number]
		width: number | 1
	}
	fill?: {
		color: [red: number, green: number, blue: number, alpha: number]
	}
}

export interface FeatureClass {
	id: number
	name: string
	style: Style
	description?: string
}

export interface Point {
	type: 'Point'
	coordinates: number[]
}

export interface LineString {
	type: 'LineString'
	coordinates: number[][]
}

export interface Polygon {
	type: 'Polygon'
	coordinates: number[][][] // Minimum of 3 points
}

interface Header {
	schemaVersion: string
	timestamp: number
	imageHash?: string
	annotationSignature?: string
}

interface Validation {
	class: number
	timestamp: number
	validatorId: string
	validatorSignature?: string
}

interface Created {
	type: 'Person' | 'Model'
	uid: string
	timestamp: number
}

export interface Feature {
	id: string
	class: number // id of feature class
	geometry: Point | LineString | Polygon
	created?: Created
	comment?: string
	validations?: Validation[]
}

export interface Layer {
	id: string
	features: Feature[]
}

export interface Annotation {
	header: Header
	layers: Layer[]
	classes: FeatureClass[]
	description?: string
}
