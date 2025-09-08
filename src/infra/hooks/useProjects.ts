"use client";

import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { IHookProps } from "../interfaces/hook-props.interface";
import { parseFilters } from "../utils/parseFilters";
import { IProject } from "../interfaces/project.interface";
import { projectService } from "../services/project.service";

interface IProjectResponseHook {
    projects: IProject[];
    projectsLoading: boolean;
    projectsRefresh: () => void;
    projectsTotal: number;
}

export const useProjects = ({
    page = 1,
    per_page = 10,
    filters = [],
    orderers = {
        orderBy: "created_at",
        orderType: "DESC",
    },
}: IHookProps): IProjectResponseHook => {
    const [data, setData] = useState<IProject[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = () => {
        if (loading) return;

        setLoading(true);

        const query = parseFilters(filters, orderers, page, per_page);

        projectService
            .getAll(query)
            .then((res) => {
                setData(res.data.result);
                setTotal(res.data.total);
            })
            .catch((err: AxiosError<{ message: string }>) => {
                console.error("Error fetching projects:", err.response?.data?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [page, JSON.stringify(filters)]);

    return {
        projects: data,
        projectsLoading: loading,
        projectsRefresh: fetchData,
        projectsTotal: total,
    };
};
