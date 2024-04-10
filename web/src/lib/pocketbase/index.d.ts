/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Animals = "animals",
	Events = "events",
	Leaderboard = "leaderboard",
	Tips = "tips",
	TipsCalc = "tips_calc",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum AnimalsSpeciesOptions {
	"Säugetier" = "Säugetier",
	"Vogel" = "Vogel",
	"Reptil" = "Reptil",
	"Amphib" = "Amphib",
	"Fisch" = "Fisch",
	"Gliedertier" = "Gliedertier",
	"Weichtier oder Stachelhäuter" = "Weichtier oder Stachelhäuter",
}

export enum AnimalsTypeOptions {
	"Wirbeltier" = "Wirbeltier",
	"Wirbellos" = "Wirbellos",
}
export type AnimalsRecord = {
	name?: string
	species?: AnimalsSpeciesOptions
	type?: AnimalsTypeOptions
}

export type EventsRecord = {
	animal?: RecordIdString
	end?: IsoDateString
	start?: IsoDateString
}

export type LeaderboardRecord = {
	points?: number
	username?: string
}

export type TipsRecord = {
	animal: RecordIdString
	user: RecordIdString
}

export type TipsCalcRecord = {
	count?: number
	name?: string
}

export enum UsersRoleOptions {
	"user" = "user",
	"admin" = "admin",
}
export type UsersRecord = {
	avatar?: string
	points?: number
	role: UsersRoleOptions
}

// Response types include system fields and match responses from the PocketBase API
export type AnimalsResponse<Texpand = unknown> = Required<AnimalsRecord> & BaseSystemFields<Texpand>
export type EventsResponse<Texpand = unknown> = Required<EventsRecord> & BaseSystemFields<Texpand>
export type LeaderboardResponse<Texpand = unknown> = Required<LeaderboardRecord> & BaseSystemFields<Texpand>
export type TipsResponse<Texpand = unknown> = Required<TipsRecord> & BaseSystemFields<Texpand>
export type TipsCalcResponse<Texpand = unknown> = Required<TipsCalcRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	animals: AnimalsRecord
	events: EventsRecord
	leaderboard: LeaderboardRecord
	tips: TipsRecord
	tips_calc: TipsCalcRecord
	users: UsersRecord
}

export type CollectionResponses = {
	animals: AnimalsResponse
	events: EventsResponse
	leaderboard: LeaderboardResponse
	tips: TipsResponse
	tips_calc: TipsCalcResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'animals'): RecordService<AnimalsResponse>
	collection(idOrName: 'events'): RecordService<EventsResponse>
	collection(idOrName: 'leaderboard'): RecordService<LeaderboardResponse>
	collection(idOrName: 'tips'): RecordService<TipsResponse>
	collection(idOrName: 'tips_calc'): RecordService<TipsCalcResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
