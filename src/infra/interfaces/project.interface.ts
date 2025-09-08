export interface IProject {
	id: string;
	name: string;
	description: string;
	status: string;
	priority: string;
	start_date: string;
	end_date: string;
	owner_id: string;
	created_at: string;
	updated_at: string;
	tasks_count: number;
	completed_tasks_count: number;
}

export interface ICreateProject {
	name: string;
	description: string;
	status: string;
	priority: string;
	start_date: string;
	end_date: string;
}
