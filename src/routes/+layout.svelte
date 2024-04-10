<script lang="ts">
	import '../app.pcss';
	import * as Dialog from '@/components/ui/dialog';
	import * as Tabs from '@/components/ui/tabs';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Avatar from '@/components/ui/avatar';
	import { Button } from '@/components/ui/button';
	import { UserRoundIcon } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema, registerSchema } from './schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

	export let data: PageData;

	const loginForm = superForm(data.loginForm, {
		validators: zodClient(loginSchema)
	});

	const { form: loginFormData, enhance: loginEnhance } = loginForm;

	const registerForm = superForm(data.registerForm, {
		validators: zodClient(registerSchema)
	});

	const { form: registerFormData, enhance: registerEnhance } = registerForm;
</script>

<div class="w-full border-b">
	<div class="container relative flex h-10 items-center justify-center">
		<a class="text-3xl font-bold" href="/">Zerzinator</a>
		{#if data.user}
			<div class="absolute right-[2.5rem] top-0">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
							<Avatar.Root class="h-8 w-8">
								<Avatar.Image src={`https://api.dicebear.com/8.x/bottts/svg?seed=${data.user.email}`} alt="@shadcn" />
								<Avatar.Fallback>NaN</Avatar.Fallback>
							</Avatar.Root>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>
								<div class="flex flex-col space-y-1">
									<p class="text-sm font-medium leading-none">{data.user.username}</p>
									<p class="text-xs leading-none text-muted-foreground">{data.user.email}</p>
								</div>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>Benutzernamen ändern</DropdownMenu.Item>
							{#if data.user.role === 'admin'}
								<DropdownMenu.Item href="/admin">Admin</DropdownMenu.Item>
							{/if}
							<DropdownMenu.Item>Account löschen</DropdownMenu.Item>
							<DropdownMenu.Item href="/logout">Logout</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		{:else}
			<Dialog.Root>
				<Dialog.Trigger
					><Button variant="ghost" size="icon" class="absolute right-[2.5rem] top-0"
						><UserRoundIcon /></Button
					></Dialog.Trigger
				>
				<Dialog.Content>
					<Tabs.Root value="account" class="w-full pr-4">
						<Tabs.List class="w-full">
							<Tabs.Trigger value="account" class="w-full">Log-In</Tabs.Trigger>
							<Tabs.Trigger value="password" class="w-full">Sign-Up</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="account">
							<form method="POST" action="?/login" use:loginEnhance>
								<Form.Field form={loginForm} name="email">
									<Form.Control let:attrs>
										<Form.Label>Email:</Form.Label>
										<Input {...attrs} type="email" bind:value={$loginFormData.email} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field form={loginForm} name="password">
									<Form.Control let:attrs>
										<Form.Label>Passwort:</Form.Label>
										<Input {...attrs} type="password" bind:value={$loginFormData.password} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Button>Einloggen</Form.Button>
							</form>
						</Tabs.Content>
						<Tabs.Content value="password">
							<form method="POST" action="?/register" use:registerEnhance>
								<Form.Field form={registerForm} name="email">
									<Form.Control let:attrs>
										<Form.Label>Email:</Form.Label>
										<Input {...attrs} type="email" bind:value={$registerFormData.email} />
									</Form.Control>
									<Form.Description>Diese Email brauchst du um dich einzuloggen.</Form.Description>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field form={registerForm} name="username">
									<Form.Control let:attrs>
										<Form.Label>Benutzername:</Form.Label>
										<Input {...attrs} bind:value={$registerFormData.username} />
									</Form.Control>
									<Form.Description>Der Benutzername wird öffentlich angezeigt.</Form.Description>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field form={registerForm} name="password">
									<Form.Control let:attrs>
										<Form.Label>Passwort:</Form.Label>
										<Input {...attrs} type="password" bind:value={$registerFormData.password} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field form={registerForm} name="passwordConfirm">
									<Form.Control let:attrs>
										<Form.Label>Passwort bestätigen:</Form.Label>
										<Input
											{...attrs}
											type="password"
											bind:value={$registerFormData.passwordConfirm}
										/>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Button>Registrieren</Form.Button>
							</form>
						</Tabs.Content>
					</Tabs.Root>
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</div>
</div>

<slot />

<div class="fixed bottom-0 h-12 w-full">
	<!-- Copyright -->
	<div class="container flex items-center justify-center h-full">
		<p class="text-muted-foreground text-sm">© 2024 Markus Hamacher, Idea by Tobias Ebert</p>
	</div>
</div>