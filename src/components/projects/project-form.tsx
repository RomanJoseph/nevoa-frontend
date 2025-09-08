"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type {
	IProject,
	ICreateProject,
} from "@/infra/interfaces/project.interface";
import { useAuth } from "@/lib/auth-context";

interface ProjectFormProps {
	project?: IProject;
	onSubmit: (data: ICreateProject) => Promise<void>;
	onCancel: () => void;
	loading?: boolean;
}

export function ProjectForm({
	project,
	onSubmit,
	onCancel,
	loading,
}: ProjectFormProps) {
	const { user } = useAuth();
	const [formData, setFormData] = useState<ICreateProject>({
		name: "",
		description: "",
		status: "planning",
		priority: "medium",
		start_date: "",
		end_date: "",
	});
	const [error, setError] = useState("");

	useEffect(() => {
		if (project) {
			// Adicione este log para ter 100% de certeza do valor ANTES de atualizar
			console.log("DENTRO DO USEEFFECT, project.status É:", project.status);

			setFormData({
				name: project.name,
				description: project.description,
				// AQUI É O PONTO CRÍTICO:
				// Garanta que você está simplesmente passando project.status
				// sem nenhuma lógica condicional extra que possa resultar em ''
				status: project.status,
				priority: project.priority,
				start_date: project.start_date
					? new Date(project.start_date).toISOString().split("T")[0]
					: "",
				end_date: project.end_date
					? new Date(project.end_date).toISOString().split("T")[0]
					: "",
			});
		}
	}, [project]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		const startDate = new Date(formData.start_date);
		const endDate = new Date(formData.end_date);

		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			setError("Please enter valid start and end dates.");
			return;
		}

		if (startDate > endDate) {
			setError("End date must be after start date");
			return;
		}

		try {
			await onSubmit(formData);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save project");
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	console.log("--- RENDER ---", {
		status: formData.status,
		priority: formData.priority,
	});

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle>{project ? "Edit Project" : "Create New Project"}</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name">Project Name</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="Enter project name"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="priority">Priority</Label>
							<Select
								value={formData.priority}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, priority: value }))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Enter project description"
							rows={3}
							required
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Select
								value={formData.status}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, status: value }))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="planning">Planning</SelectItem>
									<SelectItem value="in_progress">In Progress</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="on_hold">On Hold</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="start_date">Start Date</Label>
							<Input
								id="start_date"
								name="start_date"
								type="date"
								value={formData.start_date}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="end_date">End Date</Label>
							<Input
								id="end_date"
								name="end_date"
								type="date"
								value={formData.end_date}
								onChange={handleChange}
								required
							/>
						</div>
					</div>

					<div className="flex gap-2 pt-4">
						<Button type="submit" disabled={loading}>
							{loading
								? "Saving..."
								: project
								? "Update Project"
								: "Create Project"}
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
