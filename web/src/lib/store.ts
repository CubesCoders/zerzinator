import { get, writable, type Writable } from 'svelte/store';
import { pb } from './pocketbase/client';
import type {
	AnimalsResponse,
	EventsResponse,
	LeaderboardResponse,
	TipsCalcResponse
} from './pocketbase';
import { ClientResponseError } from 'pocketbase';

export const animals: Writable<null | AnimalsResponse<unknown>[]> = writable(null);

export const fetchAnimals = async () => {
	try {
		const res = await pb.collection('animals').getFullList();
		animals.set(res);
	} catch (e) {
		console.error(e);
	}
};

export const tips: Writable<null | TipsCalcResponse<unknown>[]> = writable(null);

export const fetchTips = async () => {
	try {
		const res = await pb.collection('tips_calc').getFullList({filter: `event="${get(event)?.id}"`});
		tips.set(res);
	} catch (e) {
		console.error(e);
	}
};

export const leaderBoard: Writable<null | LeaderboardResponse<unknown>[]> = writable(null);

export const fetchLeaderBoard = async () => {
	try {
		const res = await pb.collection('leaderboard').getFullList({
			sort: '-points'
		});
		leaderBoard.set(res);
	} catch (e) {
		console.error(e);
	}
};

export const event: Writable<null | EventsResponse<{ animal: AnimalsResponse }>> = writable(null);

export const fetchEvent = async () => {
	// current date in "YYYY-mm-dd H:i:s" format
	const now = new Date();
	const today = now.toISOString().slice(0, 10);
	const inTwoDays = new Date(now.setDate(now.getDate() + 1)).toISOString().slice(0, 10);
	const beginTime = today + ' 00:00:00.000';
	const stopTime = inTwoDays + ' 23:59:59.999';

	try {
		const res = await pb
			.collection('events')
			.getFirstListItem(`start > "${beginTime}" && end < "${stopTime}"`, {
				sort: '+start',
				expand: 'animal'
			});
		event.set(res as EventsResponse<{ animal: AnimalsResponse }>);
	} catch (e: unknown) {
        // console.log(e instanceof ClientResponseError, e.name, e);
		if (e instanceof ClientResponseError && e.name === "ClientResponseError 404") {
			try {
				const res = (await pb
					.collection('events')
					.getFirstListItem(`end < "${stopTime}"`, {
						sort: '-start',
						expand: 'animal'
					})) as EventsResponse<{ animal: AnimalsResponse }>;
				event.set(res);
			} catch (e) {
				console.error(e);
			}
		}
	}
};
