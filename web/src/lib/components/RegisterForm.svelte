<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { registerSchema, type RegisterSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';

    export let form: SuperValidated<Infer<RegisterSchema>>;

    const formObj = superForm(form, {
        validators: zodClient(registerSchema)
    });

    const { form: formData, enhance: enhance } = formObj;
</script>

<form method="POST" action="?/register" use:enhance>
    <Form.Field form={formObj} name="email">
        <Form.Control let:attrs>
            <Form.Label class="font-semibold">Email:</Form.Label>
            <Input {...attrs} type="email" bind:value={$formData.email} />
        </Form.Control>
        <Form.Description>Diese Email brauchst du, um dich später einzuloggen.</Form.Description>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field form={formObj} name="username">
        <Form.Control let:attrs>
            <Form.Label class="font-semibold">Benutzername:</Form.Label>
            <Input {...attrs} bind:value={$formData.username} />
        </Form.Control>
        <Form.Description>Der Benutzername wird öffentlich im Leaderboard angezeigt.</Form.Description>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field form={formObj} name="password">
        <Form.Control let:attrs>
            <Form.Label class="font-semibold">Passwort:</Form.Label>
            <Input {...attrs} type="password" bind:value={$formData.password} />
        </Form.Control>
        <Form.Description>
            Das Passswort muss<br>
                - mindestens 8 Zeichen lang sein,<br>
                - mindestens einen Großbuchstaben enthalten,<br>
                - mindestens einen Kleinbuchstaben enthalten,<br>
                - mindestens eine Zahl enthalten,<br>
                - mindestens ein Sonderzeichen enthalten.
        </Form.Description>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field form={formObj} name="passwordConfirm">
        <Form.Control let:attrs>
            <Form.Label class="font-semibold">Passwort bestätigen:</Form.Label>
            <Input
                {...attrs}
                type="password"
                bind:value={$formData.passwordConfirm}
            />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <!-- <Form.Field form={registerForm} name="acceptTerms" class="flex flex-row items-center space-x-3 space-y-0 p-4">
        <Form.Control let:attrs>
            <Checkbox
                {...attrs}
                bind:checked={$registerFormData.acceptTerms}
            />
            <Form.Label class="space-y-0">Du akzeptierst den <a class="underline" href="/datenschutz">Datenschutz</a></Form.Label>
            <input name={attrs.name} value={$registerFormData.acceptTerms} hidden />
        </Form.Control>
        <Form.FieldErrors />

    </Form.Field> -->
    <Form.Button class="mt-4 w-full">Registrieren</Form.Button>
</form>