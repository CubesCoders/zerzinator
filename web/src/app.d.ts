// See https://kit.svelte.dev/docs/types#app

import type { AuthModel } from "pocketbase";

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			pb: Pocketbase;
			user: AuthModel | undefined;
		}
	}
}

export {};
