import { PUBLIC_DATABASE } from '$env/static/public';
import Pocketbase from 'pocketbase';
import type { TypedPocketBase } from '.';

export const pb = new Pocketbase(PUBLIC_DATABASE) as TypedPocketBase;