<script lang="ts">
	import { onMount, tick } from 'svelte';
	// import untypedSpecies from '../assets/animals.json';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import { Button } from '@/components/ui/button';
	import { ArrowBigUpIcon, ChevronsUpDown, Check, UserRoundIcon } from 'lucide-svelte';
	import { cn } from '@/utils';
	import { pb } from '@/pocketbase/client';
	import type { PageData } from './$types';
	import type { AnimalsRecord, AnimalsResponse, TipsResponse } from '@/pocketbase';
	import { animals, event, fetchAnimals, fetchEvent, fetchLeaderBoard, fetchTips, leaderBoard, tips } from '@/store';

	export let data: PageData;

	console.log(data);
	// let animals: {[keys: string]: string[]} = untypedSpecies;

	$: animalValues = ($animals ?? []).map((animal) => ({ value: animal.id, label: animal.name }));

	let open = false;
	let value = '';
	let animalSearchValue = '';

	$: selectedValue =
		selectedEntry?.label ?? 'Wähle ein neues Tier aus...';
	$: selectedEntry = animalValues.find((animal) => animal.value === value);
	$: lazyLoadingNumber = 50;
	$: filteredAnimalValues = animalValues.filter((animal) =>
		animal.label.toLowerCase().includes(animalSearchValue.toLowerCase())
	).slice(0, lazyLoadingNumber);

	$: date = new Date($event?.start ?? 0);
	// countdown
	$: countdown = new Date((date.getTime() + (1000 * 60 * 30)) - Date.now());
	$: voteOver = countdown.getTime() <= 0 || $event?.animal !== undefined;

	setInterval(() => {
		countdown = new Date((date.getTime() + (1000 * 60 * 30)) - Date.now());
	}, 1000);

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	function onSelectScroll(e: any) {
		if (!e.target) return;
		if (!(e.target instanceof HTMLElement)) return;
		if (e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 100) {
			lazyLoadingNumber += 50;
		}
	}

	let vote: undefined | TipsResponse<{animal: AnimalsResponse}> = undefined;

	/* function parseAnimals() {
		for (const specie of Object.keys(animals)) {
			if (!animals.hasOwnProperty(specie)) continue;
			for (const animal of animals[specie]) {
				animalValues.push({ value: animal.toLowerCase().replace(/\s/g, '-'), label: animal });
			}
		}
	} */

	onMount(async () => {
		fetchEvent();
		fetchTips();
		fetchLeaderBoard();
		console.log(pb.authStore.model);
		if (data.user) {
			try {
				vote = await pb.collection('tips').getFirstListItem(`user="${data.user.id}"`, {
					expand: "animal"
				});
			} catch (error) {
				vote = undefined;
				console.error(error);
			}
		}

		if (!$animals) {
			await fetchAnimals();
			animalValues = $animals!.map((animal) => ({ value: animal.id, label: animal.name }))
		}
	});

	async function voteForAnimal(tip: string) {
		if (!data.user) return;
		if (voteOver) return;
		if (vote) {
			vote = await pb.collection('tips').update(vote.id, { animal: tip }, {
				expand: "animal"
			});
		} else {
			vote = await pb.collection('tips').create({ user: data.user.id, animal: tip }, {
				expand: "animal"
			});
		}
		fetchTips();
	}
</script>

<div class="container flex py-2 pt-8">
	<div class="w-48">
		<h2 class="mb-4 text-xl font-semibold">Leaderboard</h2>
		<div class="mt-4 grid w-full rounded-sm border">
			{#if $leaderBoard}
				<div class="flex w-full items-center justify-between gap-2 border-b py-1 last:border-b-0">
					<p class="w-full pl-1 font-semibold">Name</p>
					<div class="flex items-center">
						<span class="h-8 w-[1px] bg-border"></span>
						<p class="w-14 text-center font-semibold">Punkte</p>
					</div>
				</div>
				{#each $leaderBoard as user}
					<div class="flex w-full items-center justify-between gap-2 border-b py-1 last:border-b-0">
						<p class="line-clamp-1 w-full pl-1">{user.username}</p>
						<div class="flex items-center">
							<span class="h-8 w-[1px] bg-border"></span>
							<p class="w-14 text-center">{user.points}</p>
						</div>
					</div>
				{:else}
					<div>
						<p class="text-center">Keine Spieler.</p>
					</div>
				{/each}
			{:else}
				<div>
					<p class="p-2">Loading data...</p>
				</div>
			{/if}
		</div>
	</div>
	<div class="flex flex-1 flex-col items-center">
		<h2 class="mb-1 text-2xl font-bold">Votes für den {`${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.`}</h2>
		{#if voteOver}
			<p class="mb-8 text-lg font-semibold">Das Voting ist over! Es war: {$event?.expand?.animal.name}</p>
		{:else}
			<p class="mb-8 text-lg font-semibold">Verbleibende Zeit: {`${String(countdown.getHours()).padStart(2, '0')}:${String(countdown.getMinutes()).padStart(2, '0')}:${String(countdown.getSeconds()).padStart(2, '0')}`}</p>
		{/if}
		{#if vote}
			<p class="text-lg mb-4">Du Tippst auf: {vote.expand?.animal.name}</p>
		{/if}

		<div class="flex gap-2">
			<Popover.Root bind:open onOpenChange={() => {lazyLoadingNumber = 50}} let:ids>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						class="w-[200px] justify-between"
					>
						{selectedValue}
						<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-[200px] overflow-hidden p-0">
					<Command.Root shouldFilter={false}>
						<Command.Input bind:value={animalSearchValue}  on:input={() => lazyLoadingNumber = 50} placeholder="Suche ein Tier..." />
						<Command.Empty>Kein Tier mit dem Namen "{animalSearchValue}" gefunden.</Command.Empty>
						<Command.Group>
							<div class="max-h-96 overflow-y-auto" on:scroll={onSelectScroll}>
								{#each filteredAnimalValues as animal}
									<Command.Item
										value={animal.value}
										onSelect={(currentValue) => {
											value = currentValue;
											closeAndFocusTrigger(ids.trigger);
										}}
									>
										<Check
											class={cn('mr-2 h-4 w-4', value !== animal.value && 'text-transparent')}
										/>
										{animal.label}
									</Command.Item>
								{/each}
							</div>
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
			<Button variant="default" on:click={() => voteForAnimal(selectedEntry?.value ?? "")} disabled={voteOver}>Hinzufügen</Button>
		</div>

		<div class="mt-4 grid w-max rounded-sm border">
			{#if $tips}
				<div class="flex w-full items-center justify-between gap-2 border-b py-1 last:border-b-0">
					<div class="flex items-center">
						<p class="w-14 text-center font-semibold">Votes</p>
						<span class="h-8 w-[1px] bg-border"></span>
					</div>
					<p class="w-full font-semibold">Tier</p>
					<div class="flex items-center">
						<span class="h-8 w-[1px] bg-border"></span>
						<div class="h-10 w-10"></div>
					</div>
				</div>
				{#each $tips as tip}
					<div class="flex w-full items-center justify-between gap-2 border-b py-1 last:border-b-0">
						<div class="flex items-center">
							<p class="w-14 text-center">{tip.count}</p>
							<span class="h-8 w-[1px] bg-border"></span>
						</div>
						<p class="w-full">{tip.name}</p>
						<div class="flex items-center">
							<span class="h-8 w-[1px] bg-border"></span>
							<Button
								variant="ghost"
								size="icon"
								on:click={() => voteForAnimal(tip.id)}
								disabled={vote?.expand?.animal.name === tip.name || voteOver}><ArrowBigUpIcon /></Button
							>
						</div>
					</div>
				{:else}
					<div>
						<p class="text-center">Noch keine Votes vorhanden.</p>
					</div>
				{/each}
			{:else}
				<div>
					<p class="p-2">Loading data...</p>
				</div>
			{/if}
		</div>
	</div>
	<div class="w-48">
		<h3 class="text-center text-lg">
			Endlich ist er da, der <span class="font-bold">Zerzinator</span>. Er wurde lang ersehnt und
			nun beginnt <span class="font-bold">das Spektakel</span>.
			<span class="font-bold">Vote</span>
			jetzt für ein Tier und sei der
			<span class="font-bold">glückliche Gewinner</span>, oder auch nicht.
			<span class="font-bold">Messe dich</span>
			mit deinen Kumpels und Kumpelinnen und zeige ihnen wer der
			<span class="font-bold">wahre Zerzinator</span> ist!
		</h3>
	</div>
</div>
