"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { IUser, ICreateUser } from "@/infra/interfaces/user.interface";
import { ILogin } from "@/infra/interfaces/auth.interface";
import { authService } from "@/infra/services/auth.service";

interface AuthContextType {
	user: IUser | null;
	token: string | null;
	login: (credentials: ILogin) => Promise<void>;
	register: (userData: ICreateUser) => Promise<void>;
	logout: () => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<IUser | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check for stored auth data on mount
		const storedToken = localStorage.getItem("auth_token");
		const storedUser = localStorage.getItem("auth_user");

		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}

		setLoading(false);
	}, []);

	const login = async (credentials: ILogin) => {
		try {
			const response = await authService.login(credentials);
			const { access_token, user } = response.data;
			setToken(access_token);
			setUser(user);

			localStorage.setItem("auth_token", access_token);
			localStorage.setItem("auth_user", JSON.stringify(user));
		} catch (error) {
			throw error;
		}
	};

	const register = async (userData: ICreateUser) => {
		try {
			const response = await authService.register(userData);
			const { access_token, user } = response.data;
			setToken(token);
			setUser(user);

			localStorage.setItem("auth_token", access_token);
			localStorage.setItem("auth_user", JSON.stringify(user));
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem("auth_token");
		localStorage.removeItem("auth_user");
		window.location.href = "/"; // Redirect to login
	};

	return (
		<AuthContext.Provider
			value={{ user, token, login, register, logout, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
