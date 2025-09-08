"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useUsers } from "@/infra/hooks/useUsers";
import { userService } from "@/infra/services/user.service";
import { User as UserIcon, Plus } from "lucide-react";
import { UserForm } from "@/components/users/user-form";
import { ICreateUser } from "@/infra/interfaces/user.interface";
import { useToast } from "@/hooks/use-toast";

export default function UsersPage() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const { toast } = useToast();

	const [showForm, setShowForm] = useState(false);
	const [formLoading, setFormLoading] = useState(false);

	const { users, usersLoading, usersRefresh } = useUsers({ filters: [] });

	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/");
		}
	}, [user, authLoading, router]);

	const handleCreateUser = async (data: ICreateUser) => {
		setFormLoading(true);
		try {
			await userService.createComapanyUser(data);
			usersRefresh();
			setShowForm(false);
			toast({
				title: "Success",
				description: "User created successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to create user",
			});
		} finally {
			setFormLoading(false);
		}
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
							<h1 className="text-3xl font-bold text-foreground">Users</h1>
							<p className="text-muted-foreground mt-2">
								Manage your application users
							</p>
						</div>
						<Button onClick={() => setShowForm(true)}>
							<Plus className="mr-2 h-4 w-4" />
							New User
						</Button>
					</div>

					{usersLoading ? (
						<div className="text-center py-12">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
							<p className="mt-2 text-muted-foreground">Loading users...</p>
						</div>
					) : users.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground">No users found.</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{users.map((u) => (
								<Card key={u.id}>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-lg font-semibold">
											{u.name}
										</CardTitle>
										<UserIcon className="h-5 w-5 text-muted-foreground" />
									</CardHeader>
									<CardContent className="space-y-2">
										<p className="text-sm text-muted-foreground">
											Email: {u.email}
										</p>
										<p className="text-sm text-muted-foreground">
											Role: {u.role}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>

			{/* User Form Dialog */}
			<Dialog open={showForm} onOpenChange={setShowForm}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Create New User</DialogTitle>
					</DialogHeader>
					<UserForm
						onSubmit={handleCreateUser}
						onCancel={() => setShowForm(false)}
						loading={formLoading}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
