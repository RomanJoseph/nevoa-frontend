"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useParams } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskForm } from "@/components/tasks/task-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ITask, ICreateTask } from "@/infra/interfaces/task.interface";
import { useProject } from "@/infra/hooks/useProject";
import { useTasks } from "@/infra/hooks/useTasks";
import { useUsers } from "@/infra/hooks/useUsers";
import { taskService } from "@/infra/services/task.service";
import { Plus, Calendar, User, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const statusColors: { [key: string]: string } = {
	planning: "bg-blue-100 text-blue-800",
	in_progress: "bg-yellow-100 text-yellow-800",
	completed: "bg-green-100 text-green-800",
	on_hold: "bg-gray-100 text-gray-800",
};

const priorityColors: { [key: string]: string } = {
	low: "bg-green-100 text-green-800",
	medium: "bg-yellow-100 text-yellow-800",
	high: "bg-red-100 text-red-800",
};

export default function ProjectDetailPage() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const params = useParams();
	const { toast } = useToast();
	const projectId = params.id as string;

	const [showTaskForm, setShowTaskForm] = useState(false);
	const [editingTask, setEditingTask] = useState<ITask | undefined>();
	const [formLoading, setFormLoading] = useState(false);

	const { project, projectLoading, projectRefresh } = useProject(projectId);

	const { tasks, tasksLoading, tasksRefresh } = useTasks({
		filters: [
			{ filterBy: "project_id", filterValue: projectId, filterType: "eq" },
		],
	});
	const { users, usersLoading } = useUsers({ filters: [] });

	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/");
		}
	}, [user, authLoading, router]);

	const handleCreateTask = async (data: ICreateTask) => {
		setFormLoading(true);
		try {
			await taskService.create({ ...data, project_id: projectId });
			tasksRefresh();
			projectRefresh(); // Refresh project to update task counts
			setShowTaskForm(false);
			toast({
				title: "Success",
				description: "Task created successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to create task",
			});
		} finally {
			setFormLoading(false);
		}
	};

	const handleUpdateTask = async (data: Partial<ICreateTask>) => {
		if (!editingTask) return;

		setFormLoading(true);
		try {
			await taskService.update(editingTask.id, data);
			tasksRefresh();
			projectRefresh();
			setEditingTask(undefined);
			setShowTaskForm(false);
			toast({
				title: "Success",
				description: "Task updated successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update task",
			});
		} finally {
			setFormLoading(false);
		}
	};

	const handleDeleteTask = async (taskId: string) => {
		if (!confirm("Are you sure you want to delete this task?")) return;

		try {
			await taskService.remove(taskId);
			tasksRefresh();
			projectRefresh();
			toast({
				title: "Success",
				description: "Task deleted successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete task",
			});
		}
	};

	const handleStatusChange = async (
		taskId: string,
		status: ITask["status"]
	) => {
		try {
			await taskService.update(taskId, { status });
			tasksRefresh();
			projectRefresh();
			toast({
				title: "Success",
				description: "Task status updated",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update task status",
			});
		}
	};

	const handleEditTask = (task: ITask) => {
		setEditingTask(task);
		setShowTaskForm(true);
	};

	const handleCloseTaskForm = () => {
		setShowTaskForm(false);
		setEditingTask(undefined);
	};

	if (authLoading || !user || projectLoading || usersLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
					<p className="mt-2 text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="min-h-screen bg-background">
				<Sidebar />
				<div className="md:ml-64">
					<div className="p-6">
						<div className="text-center py-12">
							<p className="text-muted-foreground">Project not found</p>
							<Button asChild className="mt-4">
								<Link href="/projects">Back to Projects</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const progress = project.tasks_count
		? Math.round(
				((project.completed_tasks_count || 0) / project.tasks_count) * 100
		  )
		: 0;

	return (
		<div className="min-h-screen bg-background">
			<Sidebar />

			<div className="md:ml-64">
				<div className="p-6">
					{/* Header */}
					<div className="flex items-center gap-4 mb-6">
						<Button variant="ghost" size="icon" asChild>
							<Link href="/projects">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<div className="flex-1">
							<h1 className="text-3xl font-bold text-foreground text-balance">
								{project.name}
							</h1>
							<p className="text-muted-foreground mt-1">
								Project details and tasks
							</p>
						</div>
						<Button onClick={() => setShowTaskForm(true)}>
							<Plus className="mr-2 h-4 w-4" />
							New Task
						</Button>
					</div>

					{/* Project Info Card */}
					<Card className="mb-6">
						<CardHeader>
							<div className="flex flex-col sm:flex-row justify-between items-start gap-4">
								<div className="space-y-2">
									<div className="flex gap-2">
										<Badge className={statusColors[project.status]}>
											{project.status.replace("_", " ")}
										</Badge>
										<Badge className={priorityColors[project.priority]}>
											{project.priority} priority
										</Badge>
									</div>
									<CardDescription className="text-pretty">
										{project.description}
									</CardDescription>
								</div>
								<div className="text-right">
									<div className="text-2xl font-bold">{progress}%</div>
									<div className="text-sm text-muted-foreground">Complete</div>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Progress</span>
									<span>
										{project.completed_tasks_count || 0}/
										{project.tasks_count || 0} tasks
									</span>
								</div>
								<Progress value={progress} className="h-2" />
							</div>

							<div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
								<div className="flex items-center gap-1">
									<Calendar className="h-4 w-4" />
									<span>
										Start: {new Date(project.start_date).toLocaleDateString()}
									</span>
								</div>
								<div className="flex items-center gap-1">
									<Calendar className="h-4 w-4" />
									<span>
										End: {new Date(project.end_date).toLocaleDateString()}
									</span>
								</div>
								<div className="flex items-center gap-1">
									<User className="h-4 w-4" />
									<span>Owner</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Tasks Section */}
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-semibold">Tasks</h2>
							<span className="text-sm text-muted-foreground">
								{tasks.length} task{tasks.length !== 1 ? "s" : ""}
							</span>
						</div>

						{tasksLoading ? (
							<div className="text-center py-12">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
								<p className="mt-2 text-muted-foreground">Loading tasks...</p>
							</div>
						) : tasks.length === 0 ? (
							<Card>
								<CardContent className="text-center py-12">
									<p className="text-muted-foreground mb-4">
										No tasks yet. Create your first task for this project!
									</p>
									<Button onClick={() => setShowTaskForm(true)}>
										<Plus className="mr-2 h-4 w-4" />
										Create Task
									</Button>
								</CardContent>
							</Card>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{tasks.map((task) => (
									<TaskCard
										key={task.id}
										task={task}
										onEdit={handleEditTask}
										onDelete={handleDeleteTask}
										onStatusChange={handleStatusChange}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Task Form Dialog */}
			<Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingTask ? "Edit Task" : "Create New Task"}
						</DialogTitle>
					</DialogHeader>
					<TaskForm
						task={editingTask}
						projects={project ? [project] : []}
						users={users}
						defaultProjectId={project.id}
						onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
						onCancel={handleCloseTaskForm}
						loading={formLoading}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
