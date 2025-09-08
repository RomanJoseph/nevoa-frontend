import { IUser } from "./user.interface";

export interface ILogin {
	email: string;
	password: string;
}

export interface IAuthResponse {
	access_token: string;
	user: IUser;
}
