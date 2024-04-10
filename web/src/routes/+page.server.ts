import { superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types.js";
import { loginSchema, registerSchema } from "./schema.js";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";


export const load: PageServerLoad = async () => {
    return {
        loginForm: await superValidate(zod(loginSchema)),
        registerForm: await superValidate(zod(registerSchema)),
    };
};

export const actions: Actions = {
    login: async (event) => {
        const form = await superValidate(event, zod(loginSchema));

        if (!form.valid) {
            return fail(400, {
                loginForm: form,
            })
        }

        const { email, password } = form.data;
        try {
            await event.locals.pb.collection('users').authWithPassword(email, password);
            console.log('logged in');
        } catch (e) {
            return fail(401, {
                loginForm: form,
                error: e,
            });
        }
    },
    register: async (event) => {
        const form = await superValidate(event, zod(registerSchema));

        if (!form.valid) {
            return fail(400, {
                registerForm: form,
            })
        }

        const { email, password, passwordConfirm, username } = form.data;
        try {
            await event.locals.pb.collection("users").create(
                {
                    email: email,
                    password: password,
                    passwordConfirm: passwordConfirm,
                    username: username,
                    role: "user",
                }
            );
        } catch (e) {
            return fail(401, {
                registerForm: form,
                error: e,
            });
        }
    },
}

// TODO: add verification