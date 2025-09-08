import { AxiosResponse } from "axios";
import { api } from "./api";
import { IAuthResponse, ILogin } from "../interfaces/auth.interface";
import { ICreateUser } from "../interfaces/user.interface";

const login = async (values: ILogin): Promise<AxiosResponse<IAuthResponse>> => await api.post(`/auth/login`, values)
const register = async (values: ICreateUser): Promise<AxiosResponse<IAuthResponse>> => await api.post(`/auth/register`, values)

export const authService = {
    login,
    register
}
