"use client";

import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { IHookProps } from "../interfaces/hook-props.interface";
import { parseFilters } from "../utils/parseFilters";
import { ITask } from "../interfaces/task.interface";
import { taskService } from "../services/task.service";

interface ITaskResponseHook {
    tasks: ITask[];
    tasksLoading: boolean;
    tasksRefresh: () => void;
    tasksTotal: number;
}

export const useTasks = ({
    page = 1,
    per_page = 10,
    filters = [],
    orderers = {
        orderBy: "created_at",
        orderType: "DESC",
    },
}: IHookProps): ITaskResponseHook => {
    const [data, setData] = useState<ITask[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = () => {
        if (loading) return;

        setLoading(true);

        const query = parseFilters(filters, orderers, page, per_page);

        taskService
            .getAll(query)
            .then((res) => {
                setData(res.data.result);
                setTotal(res.data.total);
            })
            .catch((err: AxiosError<{ message: string }>) => {
                console.error("Error fetching tasks:", err.response?.data?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [page, JSON.stringify(filters)]);

    return {
        tasks: data,
        tasksLoading: loading,
        tasksRefresh: fetchData,
        tasksTotal: total,
    };
};
