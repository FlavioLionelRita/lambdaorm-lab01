/* eslint-disable no-use-before-define */
// THIS FILE IS NOT EDITABLE, IS MANAGED BY LAMBDA ORM
import { Queryable } from 'lambdaorm'
export class Country {
	id?: number
	name?: string
	alpha2?: string
	alpha3?: string
}
export interface QryCountry {
	id: number
	name: string
	alpha2: string
	alpha3: string
}
export let Countries: Queryable<QryCountry>
