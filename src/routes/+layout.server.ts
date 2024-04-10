import { superValidate } from "sveltekit-superforms";
import { loginSchema, registerSchema } from "./schema.js";
import { zod } from "sveltekit-superforms/adapters";

export async function load({ locals }) {
	if (locals.user) {
		console.log('user', locals.user);
		return {
			user: locals.user,
			loginForm: await superValidate(zod(loginSchema)),
			registerForm: await superValidate(zod(registerSchema)),
		};
	}

	return { user: undefined,
        loginForm: await superValidate(zod(loginSchema)),
        registerForm: await superValidate(zod(registerSchema)), };
}