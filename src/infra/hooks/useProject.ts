"use client";

import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { IProject } from "../interfaces/project.interface";
import { projectService } from "../services/project.service";

interface IProjectHook {
	project: IProject | null;
	projectLoading: boolean;
	projectRefresh: () => void;
}

export const useProject = (projectId: string): IProjectHook => {
	const [data, setData] = useState<IProject | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchData = () => {
		if (!projectId) {
			setLoading(false);
			return;
		}
		setLoading(true);
		projectService
			.getOne(projectId)
			.then((res) => {
				setData(res.data);
			})
			.catch((err: AxiosError<{ message: string }>) => {
				console.error("Error fetching project:", err.response?.data?.message);
				setData(null);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchData();
	}, [projectId]);

	return {
		project: data,
		projectLoading: loading,
		projectRefresh: fetchData,
	};
};
