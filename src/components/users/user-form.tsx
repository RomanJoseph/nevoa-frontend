"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ICreateUser, IUser } from "@/infra/interfaces/user.interface";

interface UserFormProps {
	user?: IUser;
	onSubmit: (data: ICreateUser) => Promise<void>;
	onCancel: () => void;
	loading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, loading }: UserFormProps) {
	const [formData, setFormData] = useState<ICreateUser>({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name,
				email: user.email,
				password: "", // Password should not be pre-filled for security
				role: user.role,
			});
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			await onSubmit(formData);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save user");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleRoleChange = (value: string) => {
		setFormData((prev) => ({
			...prev,
			role: value as "admin" | "manager" | "member",
		}));
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl font-bold">
					{user ? "Edit User" : "Create New User"}
				</CardTitle>
				<CardDescription>
					{user ? "Edit user details" : "Create a new user account"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							name="name"
							type="text"
							value={formData.name}
							onChange={handleChange}
							placeholder="John Doe"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="john@example.com"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Enter password" // Changed placeholder
							required={!user} // Required only for new user creation
						/>
					</div>

					<div className="flex gap-2 pt-4">
						<Button type="submit" disabled={loading}>
							{loading ? "Saving..." : user ? "Update User" : "Create User"}
						</Button>
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
