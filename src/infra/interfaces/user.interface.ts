export interface IUser {
	id: string;
	name: string;
	email: string;
	role: "admin" | "member";
	created_at: string;
	updated_at: string;
}

export interface ICreateUser {
	name: string;
	email: string;
	password: string;
	company_name: string;
}

export interface ICreateCompanyUser {
	name: string;
	email: string;
	password: string;
}
