export interface IFeatureStyle {
	stroke: {
		color: [number, number, number, number?]
		width: number
	}
	fill: {
		color: [number, number, number, number?]
	}
}

export interface IFeatureClass {
	id: number
	name: string
	description: string
	style: IFeatureStyle
}
