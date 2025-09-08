"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectForm } from "@/components/projects/project-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { IProject, ICreateProject } from "@/infra/interfaces/project.interface";
import { projectService } from "@/infra/services/project.service";
import { useProjects } from "@/infra/hooks/useProjects";
import { IParseFilter } from "@/infra/interfaces/parse-filters";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProjectsPage() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const { toast } = useToast();

	const [showForm, setShowForm] = useState(false);
	const [editingProject, setEditingProject] = useState<IProject | undefined>();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [formLoading, setFormLoading] = useState(false);
	const [filters, setFilters] = useState<IParseFilter[]>([]);

	const { projects, projectsLoading, projectsRefresh, projectsTotal } =
		useProjects({ filters });

	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/");
		}
	}, [user, authLoading, router]);

	useEffect(() => {
		const newFilters: IParseFilter[] = [];
		if (searchTerm) {
			newFilters.push({
				filterBy: "name",
				filterValue: searchTerm,
				filterType: "like",
			});
		}
		if (statusFilter !== "all") {
			newFilters.push({
				filterBy: "status",
				filterValue: statusFilter,
				filterType: "eq",
			});
		}
		setFilters(newFilters);
	}, [searchTerm, statusFilter]);

	const handleCreateProject = async (data: ICreateProject) => {
		setFormLoading(true);
		try {
			await projectService.create(data);
			projectsRefresh();
			setShowForm(false);
			toast({
				title: "Success",
				description: "Project created successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to create project",
				variant: "destructive",
			});
		} finally {
			setFormLoading(false);
		}
	};

	const handleUpdateProject = async (data: Partial<ICreateProject>) => {
		if (!editingProject) return;

		setFormLoading(true);
		try {
			await projectService.update(editingProject.id, data);
			projectsRefresh();
			setEditingProject(undefined);
			setShowForm(false);
			toast({
				title: "Success",
				description: "Project updated successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update project",
				variant: "destructive",
			});
		} finally {
			setFormLoading(false);
		}
	};

	const handleDeleteProject = async (projectId: string) => {
		if (!confirm("Are you sure you want to delete this project?")) return;

		try {
			await projectService.remove(projectId);
			projectsRefresh();
			toast({
				title: "Success",
				description: "Project deleted successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete project",
				variant: "destructive",
			});
		}
	};

	const handleEditProject = (project: IProject) => {
		setEditingProject(project);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingProject(undefined);
	};

	if (authLoading || !user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
					<p className="mt-2 text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Sidebar />

			<div className="md:ml-64">
				<div className="p-6">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
						<div>
							<h1 className="text-3xl font-bold text-foreground">Projects</h1>
							<p className="text-muted-foreground mt-1">
								Manage and track your projects
							</p>
						</div>
						{user?.role === "admin" && (
							<Button onClick={() => setShowForm(true)}>
								<Plus className="mr-2 h-4 w-4" />
								New Project
							</Button>
						)}
					</div>

					{/* Filters */}
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search projects..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-48">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="planning">Planning</SelectItem>
								<SelectItem value="in_progress">In Progress</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="on_hold">On Hold</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Projects Grid */}
					{projectsLoading ? (
						<div className="text-center py-12">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
							<p className="mt-2 text-muted-foreground">Loading projects...</p>
						</div>
					) : projects.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground">
								{projectsTotal === 0
									? "No projects yet. Create your first project!"
									: "No projects match your filters."}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{projects.map((project) => (
								<ProjectCard
									key={project.id}
									project={project}
									onEdit={handleEditProject}
									onDelete={handleDeleteProject}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Project Form Dialog */}
			<Dialog open={showForm} onOpenChange={setShowForm}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingProject ? "Edit Project" : "Create New Project"}
						</DialogTitle>
					</DialogHeader>
					<ProjectForm
						project={editingProject}
						onSubmit={
							editingProject ? handleUpdateProject : handleCreateProject
						}
						onCancel={handleCloseForm}
						loading={formLoading}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
