import { AxiosResponse } from "axios";
import { api } from "./api";
import { ICreateCompanyUser, IUser } from "../interfaces/user.interface";
import { IApiResponse, IApiSingleResponse } from "../interfaces/api.interface";

const getAll = (
	query?: string
): Promise<AxiosResponse<IApiResponse<IUser>>> => {
	return api.get(`/users${query || ""}`);
};

const getOne = (
	id: string
): Promise<AxiosResponse<IApiSingleResponse<IUser>>> => {
	return api.get(`/users/${id}`);
};

const createComapanyUser = (data: ICreateCompanyUser) => {
	return api.post(`/users/company-user`, data);
};

export const userService = {
	getAll,
	getOne,
	createComapanyUser,
};
