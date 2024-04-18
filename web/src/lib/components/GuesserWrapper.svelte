<script lang="ts">
	import * as Tabs from '@/components/ui/tabs';
	import { format } from 'date-fns-tz';
	import Guesser from './Guesser.svelte';
	import { countdown, event } from '@/store';
	import { de } from 'date-fns/locale';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { LoginSchema, RegisterSchema } from './schema';
	import LoginForm from './LoginForm.svelte';
	import RegisterForm from './RegisterForm.svelte';

	export let user: { [key: string]: any } | undefined;
	export let loginForm: SuperValidated<Infer<LoginSchema>>;
	export let registerForm: SuperValidated<Infer<RegisterSchema>>;

	function getCountdownString(countdown: number) {
		console.log(countdown);
		// only hours minutes and seconds
		const hours = Math.floor(countdown / (1000 * 60 * 60));
		const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
</script>

<div class="flex flex-col items-center">
	{#if user}
		{#if $event}
			<h2 class="mb-2 text-2xl font-bold text-center">
				Tipps für {format($event.start, "EEEE 'den' dd.MM.", { locale: de })}
			</h2>
			{#if $countdown <= 0}
				<p class="mb-8 text-lg font-semibold text-center">
					Das Tippspiel ist vorbei! Es war: {$event?.expand?.animal.name ?? 'Kein Tier??'}
				</p>
			{:else}
				<p class="mb-8 text-lg font-semibold text-center">
					Verbleibende Zeit: {getCountdownString($countdown)}
				</p>
			{/if}
		{/if}

		<Guesser {user} />
	{:else}
		<p class="text-lg font-semibold text-center">Du musst angemeldet sein, um tippen zu können.</p>
        <div class="w-full max-w-md mt-8">
            <Tabs.Root value="login" class="w-full pr-4">
                <Tabs.List class="w-full">
                    <Tabs.Trigger value="login" class="w-full">Einloggen</Tabs.Trigger>
                    <Tabs.Trigger value="signup" class="w-full">Registrieren</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="login">
                    <LoginForm form={loginForm} />
                </Tabs.Content>
                <Tabs.Content value="signup">
                    <RegisterForm form={registerForm} />
                </Tabs.Content>
            </Tabs.Root>
        </div>
	{/if}
</div>
