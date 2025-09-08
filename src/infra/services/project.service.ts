import { AxiosResponse } from "axios";
import { api } from "./api";
import { IProject, ICreateProject } from "../interfaces/project.interface";
import { IApiResponse, IApiSingleResponse } from "../interfaces/api.interface";

const getAll = (query?: string): Promise<AxiosResponse<IApiResponse<IProject>>> => {
    return api.get(`/projects${query || ''}`);
};

const getOne = (id: string): Promise<AxiosResponse<IApiSingleResponse<IProject>>> => {
    return api.get(`/projects/${id}`);
};

const create = (data: ICreateProject): Promise<AxiosResponse<IApiSingleResponse<IProject>>> => {
    return api.post("/projects", data);
};

const update = (id: string, data: Partial<ICreateProject>): Promise<AxiosResponse<IApiSingleResponse<IProject>>> => {
    return api.put(`/projects/${id}`, data);
};

const remove = (id: string): Promise<AxiosResponse<void>> => {
    return api.delete(`/projects/${id}`);
};

export const projectService = {
    getAll,
    getOne,
    create,
    update,
    remove,
};
