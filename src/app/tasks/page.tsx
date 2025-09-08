"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { TaskCard } from "@/components/tasks/task-card"
import { TaskForm } from "@/components/tasks/task-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ITask, ICreateTask } from "@/infra/interfaces/task.interface"
import { useTasks } from "@/infra/hooks/useTasks"
import { useProjects } from "@/infra/hooks/useProjects"
import { useUsers } from "@/infra/hooks/useUsers"
import { taskService } from "@/infra/services/task.service"
import { IParseFilter } from "@/infra/interfaces/parse-filters"
import { Plus, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<ITask | undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [formLoading, setFormLoading] = useState(false)
  const [filters, setFilters] = useState<IParseFilter[]>([])

  const { tasks, tasksLoading, tasksRefresh } = useTasks({ filters })
  const { projects, projectsLoading } = useProjects({ filters: [] })
  const { users, usersLoading } = useUsers({ filters: [] })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const newFilters: IParseFilter[] = []
    if (searchTerm) {
      newFilters.push({
        filterBy: "title",
        filterValue: searchTerm,
        filterType: "like",
      })
    }
    if (statusFilter !== "all") {
      newFilters.push({
        filterBy: "status",
        filterValue: statusFilter,
        filterType: "eq",
      })
    }
    if (projectFilter !== "all") {
      newFilters.push({
        filterBy: "project_id",
        filterValue: projectFilter,
        filterType: "eq",
      })
    }
    setFilters(newFilters)
  }, [searchTerm, statusFilter, projectFilter])

  const handleCreateTask = async (data: ICreateTask) => {
    setFormLoading(true)
    try {
      await taskService.create(data)
      tasksRefresh()
      setShowForm(false)
      toast({
        title: "Success",
        description: "Task created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateTask = async (data: Partial<ICreateTask>) => {
    if (!editingTask) return

    setFormLoading(true)
    try {
      await taskService.update(editingTask.id, data)
      tasksRefresh()
      setEditingTask(undefined)
      setShowForm(false)
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      await taskService.remove(taskId)
      tasksRefresh()
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (
    taskId: string,
    status: ITask["status"]
  ) => {
    try {
      await taskService.update(taskId, { status })
      tasksRefresh()
      toast({
        title: "Success",
        description: "Task status updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const handleEditTask = (task: ITask) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTask(undefined)
  }

  if (authLoading || !user || projectsLoading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="md:ml-64">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track your tasks
              </p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
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
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tasks Grid */}
          {tasksLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No tasks match your filters.
              </p>
            </div>
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

      {/* Task Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={editingTask}
            projects={projects}
            users={users}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCloseForm}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
