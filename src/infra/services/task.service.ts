import { AxiosResponse } from "axios";
import { api } from "./api";
import { ITask, ICreateTask } from "../interfaces/task.interface";
import { IApiResponse, IApiSingleResponse } from "../interfaces/api.interface";

const getAll = (query?: string): Promise<AxiosResponse<IApiResponse<ITask>>> => {
    return api.get(`/tasks${query || ''}`);
};

const getOne = (id: string): Promise<AxiosResponse<IApiSingleResponse<ITask>>> => {
    return api.get(`/tasks/${id}`);
};

const create = (data: ICreateTask): Promise<AxiosResponse<IApiSingleResponse<ITask>>> => {
    return api.post("/tasks", data);
};

const update = (id: string, data: Partial<ICreateTask>): Promise<AxiosResponse<IApiSingleResponse<ITask>>> => {
    return api.put(`/tasks/${id}`, data);
};

const remove = (id: string): Promise<AxiosResponse<void>> => {
    return api.delete(`/tasks/${id}`);
};

export const taskService = {
    getAll,
    getOne,
    create,
    update,
    remove,
};
