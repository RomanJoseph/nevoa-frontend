import axios from "axios";

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002",
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("auth_token");
	console.log("token", token);

	if (token) {
		config.headers = config.headers ?? {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const { response } = error ?? {};
		if (response?.status === 401) {
			localStorage.removeItem("auth_token");
			localStorage.removeItem("auth_user");
			window.location.href = "/";
		}
		return Promise.reject(error);
	}
);
