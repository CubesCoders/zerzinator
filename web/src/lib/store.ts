import { get, writable, type Writable } from 'svelte/store';
import { pb } from './pocketbase/client';
import type {
	AnimalsResponse,
	EventsResponse,
	LeaderboardResponse,
	TipsCalcResponse,
	TipsResponse
} from './pocketbase';
import { ClientResponseError } from 'pocketbase';
import { toast } from 'svelte-sonner';

export const animals: Writable<AnimalsResponse<unknown>[]> = writable();

export const fetchAnimals = async () => {
	try {
		const res = await pb.collection('animals').getFullList();
		animals.set(res);
	} catch (e) {
		toast.error(`No animals found: ${e}`);
		console.error(e);
	}
};

export const tips: Writable<TipsCalcResponse<unknown>[]> = writable();

export const fetchTips = async () => {
	try {
		const res = await pb.collection('tips_calc').getFullList({filter: `event="${get(event)?.id}"`});
		tips.set(res);
	} catch (e) {
		toast.error(`No tips found: ${e}`);
		console.error(e);
	}
};

export const leaderBoard: Writable<LeaderboardResponse<unknown>[]> = writable();

export const fetchLeaderBoard = async () => {
	try {
		const res = await pb.collection('leaderboard').getFullList({
			sort: '-points'
		});
		leaderBoard.set(res);
	} catch (e) {
		toast.error(`No leaderboard found: ${e}`);
		console.error(e);
	}
};

export const event: Writable<EventsResponse<{ animal: AnimalsResponse }>> = writable();

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
			}) as EventsResponse<{ animal: AnimalsResponse }>;
		event.set(res);
		const countdownStart = new Date(res.start).getTime() - new Date().getTime();
		countdown.set(countdownStart);
		if (countdownStart > 0) {
			startCountdown();
		}
		fetchGuess(res);
		fetchTips();
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
				const countdownStart = new Date(res.start).getTime() - new Date().getTime();
				countdown.set(countdownStart);
				if (countdownStart > 0) {
					startCountdown();
				}
				fetchGuess(res);
				fetchTips();
			} catch (e) {
				toast.error(`No event found: ${e}`);
				console.error(e);
			}
		}
	}
};

export const guess: Writable<TipsResponse<{animal: AnimalsResponse}>> = writable();

const fetchGuess = async (event: EventsResponse<{animal: AnimalsResponse}>) => {
	const user = pb.authStore.model;
	if (!user) return;

	try {
		const res = await pb.collection('tips').getFirstListItem(`event="${event.id}" && user="${user.id}"`, {expand: "animal"});
		guess.set(res as TipsResponse<{animal: AnimalsResponse}>);
	} catch (e) {
		console.error(e);
	}
};

export const countdown: Writable<number> = writable();

const startCountdown = () => {
	const interval = setInterval(() => {
		countdown.update((time) => {
			if (time <= 0) {
				console.log('Event ended');
				clearInterval(interval);
				fetchEvent();
				return 0;
			}
			return time - 1000;
		});
	}, 1000);
};