import { IUser } from "./user.interface";

export interface ITask {
	id: string;
	title: string;
	description: string;
	status: string;
	priority: string;
	project_id: string;
	assignee_id: string;
	due_date: string;
	created_at: string;
	updated_at: string;
	user?: IUser;
}

export interface ICreateTask {
	title: string;
	description: string;
	status: string;
	priority: string;
	project_id: string;
	assignee_id: string;
	due_date: string;
}
