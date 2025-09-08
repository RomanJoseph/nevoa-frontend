"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { IProject } from "@/infra/interfaces/project.interface";
import { Calendar, User, Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface ProjectCardProps {
	project: IProject;
	onEdit?: (project: IProject) => void;
	onDelete?: (projectId: string) => void;
}

const statusColors = {
	planning: "bg-blue-100 text-blue-800",
	in_progress: "bg-yellow-100 text-yellow-800",
	completed: "bg-green-100 text-green-800",
	on_hold: "bg-gray-100 text-gray-800",
};

const priorityColors = {
	low: "bg-green-100 text-green-800",
	medium: "bg-yellow-100 text-yellow-800",
	high: "bg-red-100 text-red-800",
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
	const { user } = useAuth();
	const isAdmin = user?.role === "admin";

	const progress = project.tasks_count
		? Math.round(
				((project.completed_tasks_count || 0) / project.tasks_count) * 100
		  )
		: 0;

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
				<div className="space-y-1">
					<CardTitle className="text-lg font-semibold text-balance">
						<Link
							href={`/projects/${project.id}`}
							className="hover:text-primary"
						>
							{project.name}
						</Link>
					</CardTitle>
					<div className="flex gap-2">
						<Badge className={statusColors[project.status]}>
							{project.status.replace("_", " ")}
						</Badge>
						<Badge className={priorityColors[project.priority]}>
							{project.priority}
						</Badge>
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="ghost" size="icon" asChild>
						<Link href={`/projects/${project.id}`}>
							<Eye className="h-4 w-4" />
						</Link>
					</Button>
					{isAdmin && (
						<>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onEdit?.(project)}
							>
								<Pencil className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onDelete?.(project.id)}
								className="text-destructive"
							>
								<Trash className="h-4 w-4" />
							</Button>
						</>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-muted-foreground text-pretty">
					{project.description}
				</p>

				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>Progress</span>
						<span>
							{project.completed_tasks_count || 0}/{project.tasks_count || 0}{" "}
							tasks
						</span>
					</div>
					<Progress value={progress} className="h-2" />
				</div>

				<div className="flex items-center justify-between text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						<span>{new Date(project.end_date).toLocaleDateString()}</span>
					</div>
					<div className="flex items-center gap-1">
						<User className="h-4 w-4" />
						<span>Owner</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
