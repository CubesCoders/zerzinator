<script lang="ts">
	import * as Table from '@/components/ui/table';
	import type { PageData } from './$types';
	import {
		leaderBoard,
	} from '@/store';
	import GuesserWrapper from '@/components/GuesserWrapper.svelte';

	export let data: PageData;
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
	<div class="flex-1 order-first lg:order-none">
		<GuesserWrapper user={data.user} loginForm={data.loginForm} registerForm={data.registerForm} />
	</div>
	<div class="lg:w-48 w-9/12">
		<h3 class="text-center text-lg">
			Endlich ist er da, der <span class="font-bold">Zerzinator</span>. Er wurde lang ersehnt und
			nun beginnt <span class="font-bold">das Spektakel</span>.
			<span class="font-bold">Tippe</span>
			jetzt auf ein Tier und sei der
			<span class="font-bold">glückliche Gewinner</span>, oder auch nicht.
			<span class="font-bold">Messe dich</span>
			mit deinen Kumpels und Kumpelinnen und zeige ihnen wer der
			<span class="font-bold">wahre Zerzinator</span> ist!
		</h3>
		<h4 class="text-center font-semibold mt-8">Du hast Ideen oder Verbesserungsvorschläge?</h4>
		<p class="text-center mt-2">Lass es mich <a class="underline text-muted-foreground" href="https://github.com/CubesCoders/zerzinator/discussions">hier</a> wissen.</p>
	</div>
</div>
