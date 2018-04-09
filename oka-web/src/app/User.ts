import { Gender } from './Gender';

export class User {
    id: string;
	name: string;
	language: string;
	gender: Gender;
	registerDate: number;
	endSubscription: string;
	roles: Array<string>;
	lastAccess: number;
}