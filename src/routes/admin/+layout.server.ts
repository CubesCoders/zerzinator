import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
    if (locals.user && locals.user.role === 'admin') {
        return {
            user: locals.user
        }
    } else {
        redirect(303, '/')
    }
}