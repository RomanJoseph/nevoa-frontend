"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ITask } from "@/infra/interfaces/task.interface";
import {
	Calendar,
	User,
	MoreHorizontal,
	CheckCircle,
	Pencil,
	Trash,
	XCircle,
} from "lucide-react";

interface TaskCardProps {
	task: ITask;
	onEdit?: (task: ITask) => void;
	onDelete?: (taskId: string) => void;
	onStatusChange?: (taskId: string, status: ITask["status"]) => void;
}

const statusColors = {
	todo: "bg-gray-100 text-gray-800",
	in_progress: "bg-blue-100 text-blue-800",
	completed: "bg-green-100 text-green-800",
};

const priorityColors = {
	low: "bg-green-100 text-green-800",
	medium: "bg-yellow-100 text-yellow-800",
	high: "bg-red-100 text-red-800",
};

export function TaskCard({
	task,
	onEdit,
	onDelete,
	onStatusChange,
}: TaskCardProps) {
	const isOverdue =
		new Date(task.due_date) < new Date() && task.status !== "completed";

	return (
		<Card
			className={`hover:shadow-md transition-shadow ${
				isOverdue ? "border-destructive" : ""
			}`}
		>
			<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
				<div className="space-y-1">
					<CardTitle className="text-lg font-semibold text-balance">
						{task.title}
					</CardTitle>
					<div className="flex gap-2">
						<Badge className={statusColors[task.status]}>
							{task.status.replace("_", " ")}
						</Badge>
						<Badge className={priorityColors[task.priority]}>
							{task.priority}
						</Badge>
						{isOverdue && <Badge variant="destructive">Overdue</Badge>}
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="ghost" size="icon" onClick={() => onEdit?.(task)}>
						<Pencil className="h-4 w-4" />
					</Button>
					{task.status !== "completed" ? (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => onStatusChange?.(task.id, "completed")}
						>
							<CheckCircle className="h-4 w-4" />
						</Button>
					) : (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => onStatusChange?.(task.id, "todo")}
						>
							<XCircle className="h-4 w-4" />
						</Button>
					)}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onDelete?.(task.id)}
						className="text-destructive"
					>
						<Trash className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-muted-foreground text-pretty">
					{task.description}
				</p>

				<div className="flex items-center justify-between text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						<span>{new Date(task.due_date).toLocaleDateString()}</span>
					</div>
					<div className="flex items-center gap-1">
						<User className="h-4 w-4" />
						<span>{task.user?.name ?? "No assigment"}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
