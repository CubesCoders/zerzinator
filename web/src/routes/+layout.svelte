<script lang="ts">
	import '../app.pcss';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Avatar from '@/components/ui/avatar';
	import { Button } from '@/components/ui/button';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { fetchAnimals, fetchEvent, fetchLeaderBoard } from '@/store';
	import { pb } from '@/pocketbase/client';
	import { Toaster } from "@/components/ui/sonner";
	import { toast } from 'svelte-sonner';

	export let data: PageData;

	onMount(async () => {
		fetchLeaderBoard();
		fetchAnimals();
		fetchEvent();
	});

	function deleteAccount() {
		if (confirm('Möchtest du deinen Account unwiederruflich wirklich löschen?')) {
			pb.collection("users").delete(data.user!.id).then(() => {
				location.href = '/logout';
			}).catch((e) => {
				toast.error('Fehler beim Löschen des Accounts');
				console.error(e);
			});
		}
	}
</script>

<Toaster position="bottom-right" expand={true} />

<div class="w-full border-b">
	<div class="container relative flex h-10 items-center justify-center">
		<a class="text-3xl font-bold" href="/">Zerzinator</a>
		{#if data.user}
			<div class="absolute right-[2.5rem] top-0">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
							<Avatar.Root class="h-8 w-8">
								<Avatar.Image
									src={`https://api.dicebear.com/8.x/bottts/svg?seed=${data.user.email}`}
									alt="@shadcn"
								/>
								<Avatar.Fallback>NaN</Avatar.Fallback>
							</Avatar.Root>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>
								<div class="flex flex-col space-y-1">
									<p class="text-sm font-medium leading-none">{data.user.username}</p>
									<p class="text-muted-foreground text-xs leading-none">{data.user.email}</p>
								</div>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>Benutzernamen ändern</DropdownMenu.Item>
							{#if data.user.role === 'admin'}
								<DropdownMenu.Item href="/admin">Admin</DropdownMenu.Item>
							{/if}
							<DropdownMenu.Item on:click={deleteAccount}>Account löschen</DropdownMenu.Item>
							<DropdownMenu.Item href="/logout">Logout</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		{/if}
	</div>
</div>

<slot />

<div class="bg-background fixed bottom-0 h-12 w-full">
	<!-- Copyright -->
	<div class="container flex h-full items-center justify-center">
		<p class="text-muted-foreground text-sm text-center">
			© 2024 Markus Hamacher, Idea by Tobias Ebert | <a
				class="hover:text-foreground underline"
				href="/datenschutz">Datenschutz</a
			>
		</p>
	</div>
</div>
