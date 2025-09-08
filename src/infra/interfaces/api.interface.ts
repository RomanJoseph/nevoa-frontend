export interface IApiResponse<T> {
	result: T[];
	total: number;
}

export type IApiSingleResponse<T> = T;
