import { PUBLIC_DATABASE } from '$env/static/public';
import Pocketbase from 'pocketbase';

const allowedHeaders = ['retry-after', 'content-type' ];

export async function handle({ event, resolve }) {
	event.locals.pb = new Pocketbase(PUBLIC_DATABASE);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
    } catch (_) {
        // clear the auth store on failed refresh
        event.locals.pb.authStore.clear();
    }

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = structuredClone(event.locals.pb.authStore.model);
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => allowedHeaders.includes(name)
	});

	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({
			secure: event.url.protocol === 'https:',
			httpOnly: false
		})
	);

	return response;
}