<script lang="ts">
	import { onMount, tick } from 'svelte';
	// import untypedSpecies from '../assets/animals.json';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import * as Table from '@/components/ui/table';
	import { Button } from '@/components/ui/button';
	import { ArrowBigUpIcon, ChevronsUpDown, Check, UserRoundIcon } from 'lucide-svelte';
	import { cn } from '@/utils';
	import { pb } from '@/pocketbase/client';
	import type { PageData } from './$types';
	import type { AnimalsRecord, AnimalsResponse, TipsResponse } from '@/pocketbase';
	import {
		animals,
		event,
		fetchAnimals,
		fetchEvent,
		fetchLeaderBoard,
		fetchTips,
		leaderBoard,
		tips
	} from '@/store';
	import { DateTime } from 'luxon';

	function getDateTime(date: string) {
		date = date.replace(' ', 'T');
		if (date === "") return DateTime.fromObject({millisecond: 0});
		return DateTime.fromISO(date).setZone("Europe/Berlin").setLocale('de-DE');
	}

	export let data: PageData;
	// let animals: {[keys: string]: string[]} = untypedSpecies;

	$: animalValues = ($animals ?? []).map((animal) => ({ value: animal.id, label: animal.name }));

	let open = false;
	let value = '';
	let animalSearchValue = '';

	$: selectedValue = selectedEntry?.label ?? 'Wähle ein neues Tier aus...';
	$: selectedEntry = animalValues.find((animal) => animal.value === value);
	$: lazyLoadingNumber = 50;
	$: filteredAnimalValues = animalValues
		.filter((animal) => animal.label.toLowerCase().includes(animalSearchValue.toLowerCase()))
		.slice(0, lazyLoadingNumber);

	$: date = getDateTime($event?.start ?? "");
	// countdown
	$: countdown = date.diffNow(["hours", "minutes", "seconds"]).plus({minutes: 30});
	$: voteOver = countdown.toMillis() <= 0 || $event?.animal !== "";


	setInterval(() => {
		countdown = date.diffNow(["hours", "minutes", "seconds"]/* date.toMillis() + 1000 * 60 * 30 - Date.now() */).plus({minutes: 30});
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

	let vote: undefined | TipsResponse<{ animal: AnimalsResponse }> = undefined;

	/* function parseAnimals() {
		for (const specie of Object.keys(animals)) {
			if (!animals.hasOwnProperty(specie)) continue;
			for (const animal of animals[specie]) {
				animalValues.push({ value: animal.toLowerCase().replace(/\s/g, '-'), label: animal });
			}
		}
	} */

	onMount(async () => {
		if (data.user) {
			try {
				vote = await pb.collection('tips').getFirstListItem(`user="${data.user.id}"`, {
					expand: 'animal'
				});
			} catch (error) {
				vote = undefined;
				console.error(error);
			}
		}

		/* if (!$animals) {
			await fetchAnimals();
			animalValues = 
		} */
	});

	async function voteForAnimal(tip: string) {
		if (!data.user) return;
		if (voteOver) return;
		if (!$event) return;
		if (vote) {
			vote = await pb.collection('tips').update(
				vote.id,
				{ animal: tip },
				{
					expand: 'animal'
				}
			);
		} else {
			vote = await pb.collection('tips').create(
				{ user: data.user.id, animal: tip, event: $event.id },
				{
					expand: 'animal'
				}
			);
		}
		fetchTips();
	}
</script>

<svelte:head>
	<title>Zerzinator</title>
</svelte:head>

<div class="container flex lg:flex-row flex-col gap-y-8 lg:gap-y-0 lg:gap-x-8 items-center lg:items-start py-2 pt-8 pb-12">
	<div class="lg:w-48 w-full">
		<h2 class="mb-4 text-center text-xl font-semibold">Leaderboard</h2>
		<div class="mt-4">
			{#if $leaderBoard}
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head class="text-center">Punkte</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each $leaderBoard as user}
							<Table.Row>
								<Table.Cell class="line-clamp-1 py-2">{user.username}</Table.Cell>
								<Table.Cell class="py-2 text-center">{user.points}</Table.Cell>
							</Table.Row>
						{:else}
							<div>
								<p class="text-center p-2 text-muted-foreground">Keine Spieler angemeldet.</p>
							</div>
						{/each}
					</Table.Body>
				</Table.Root>
			{:else}
				<div>
					<p class="p-2">Loading data...</p>
				</div>
			{/if}
		</div>
	</div>
	<div class="flex flex-1 flex-col items-center order-first lg:order-none w-full">
		<h2 class="mb-1 text-2xl font-bold">
			Votes für {date.toFormat("EEEE 'den' dd.MM")}
		</h2>
		{#if voteOver}
			<p class="mb-8 text-lg font-semibold">
				Das Voting ist over! Es war: {$event?.expand?.animal.name}
			</p>
		{:else}
			<p class="mb-8 text-lg font-semibold">
				Verbleibende Zeit: {countdown.toFormat('hh:mm:ss')}
			</p>
		{/if}
		{#if vote}
			<p class="mb-4 text-lg">Du Tippst auf: {vote.expand?.animal.name}</p>
		{/if}

		<div class="flex gap-2 lg:flex-row flex-col">
			<Popover.Root
				bind:open
				onOpenChange={() => {
					lazyLoadingNumber = 50;
				}}
				let:ids
			>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						class="max-w-96 justify-between"
					>
						{selectedValue}
						<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-[200px] overflow-hidden p-0">
					<Command.Root shouldFilter={false}>
						<Command.Input
							bind:value={animalSearchValue}
							on:input={() => (lazyLoadingNumber = 50)}
							placeholder="Suche ein Tier..."
						/>
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
			<Button
				variant="default"
				on:click={() => voteForAnimal(selectedEntry?.value ?? '')}
				disabled={voteOver}>Hinzufügen</Button
			>
		</div>

		<div class="mt-4 w-full">
			{#if $tips}
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="text-center">Votes</Table.Head>
							<Table.Head>Tier</Table.Head>
							<Table.Head></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each $tips as tip, i (i)}
							<Table.Row>
								<Table.Cell class="py-1 text-center">{tip.count}</Table.Cell>
								<Table.Cell class="py-1">{tip.name}</Table.Cell>
								<Table.Cell class="py-1">
									<Button
										variant="ghost"
										size="icon"
										on:click={() => voteForAnimal(tip.id)}
										disabled={vote?.expand?.animal.name === tip.name || voteOver}
										><ArrowBigUpIcon /></Button
									>
								</Table.Cell>
							</Table.Row>
						{:else}
							<Table.Row>
								<Table.Cell></Table.Cell>
								<Table.Cell class="text-muted-foreground">Noch keine Votes vorhanden.</Table.Cell>
								<Table.Cell></Table.Cell>
							</Table.Row>
							<!-- <div>
								<p class="text-center p-2 text-muted-foreground">Noch keine Votes vorhanden.</p>
							</div> -->
						{/each}
					</Table.Body>
				</Table.Root>
			{:else}
				<div>
					<p class="p-2">Loading data...</p>
				</div>
			{/if}
		</div>
	</div>
	<div class="lg:w-48 w-9/12">
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
		<h4 class="text-center font-semibold mt-8">Du hast Ideen oder verbesserungsvorschläge?</h4>
		<p class="text-center mt-2">Lass es mich <a class="underline text-muted-foreground" href="https://github.com/CubesCoders/zerzinator/discussions">hier</a> wissen.</p>
	</div>
</div>
