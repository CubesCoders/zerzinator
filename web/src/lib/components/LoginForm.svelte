<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { loginSchema, type LoginSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';

    export let form: SuperValidated<Infer<LoginSchema>>;

    const formObj = superForm(form, {
        validators: zodClient(loginSchema)
    });

    const { form: formData, enhance: enhance } = formObj;
</script>

<form method="POST" action="?/login" use:enhance>
    <Form.Field form={formObj} name="email">
        <Form.Control let:attrs>
            <Form.Label class="font-semibold">Email:</Form.Label>
            <Input {...attrs} type="email" bind:value={$formData.email} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field form={formObj} name="password">
        <Form.Control let:attrs>
            <Form.Label class="font-semibold">Passwort:</Form.Label>
            <Input {...attrs} type="password" bind:value={$formData.password} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button class="mt-4 w-full">Einloggen</Form.Button>
</form>