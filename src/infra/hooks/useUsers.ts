"use client";

import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { IHookProps } from "../interfaces/hook-props.interface";
import { parseFilters } from "../utils/parseFilters";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

interface IUserResponseHook {
    users: IUser[];
    usersLoading: boolean;
    usersRefresh: () => void;
    usersTotal: number;
}

export const useUsers = ({
    page = 1,
    per_page = 10,
    filters = [],
    orderers = {
        orderBy: "created_at",
        orderType: "DESC",
    },
}: IHookProps): IUserResponseHook => {
    const [data, setData] = useState<IUser[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = () => {
        if (loading) return;

        setLoading(true);

        const query = parseFilters(filters, orderers, page, per_page);

        userService
            .getAll(query)
            .then((res) => {
                setData(res.data.result);
                setTotal(res.data.total);
            })
            .catch((err: AxiosError<{ message: string }>) => {
                console.error("Error fetching users:", err.response?.data?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [page, JSON.stringify(filters)]);

    return {
        users: data,
        usersLoading: loading,
        usersRefresh: fetchData,
        usersTotal: total,
    };
};
