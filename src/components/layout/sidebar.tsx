"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
	LayoutDashboard,
	FolderOpen,
	CheckSquare,
	Users,
	Settings,
	LogOut,
	Menu,
	X,
} from "lucide-react";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Projects", href: "/projects", icon: FolderOpen },
	{ name: "Tasks", href: "/tasks", icon: CheckSquare },
	{ name: "Users", href: "/users", icon: Users },
];

export function Sidebar() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	const { user, logout } = useAuth();

	return (
		<>
			{/* Mobile menu button */}
			<Button
				variant="ghost"
				size="icon"
				className="fixed top-4 left-4 z-50 md:hidden"
				onClick={() => setIsOpen(!isOpen)}
			>
				{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
			</Button>

			{/* Sidebar */}
			<div
				className={cn(
					"fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out md:translate-x-0",
					isOpen ? "translate-x-0" : "-translate-x-full"
				)}
			>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-center h-16 px-4 border-b border-sidebar-border">
						<h1 className="text-xl font-bold text-sidebar-foreground">
							ProjectHub
						</h1>
					</div>

					{/* Navigation */}
					<nav className="flex-1 px-4 py-6 space-y-2">
						{navigation.map((item) => {
							if (
								(item.name === "Users" || item.name === "Settings") &&
								user?.role !== "admin"
							) {
								return null;
							}
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
										isActive
											? "bg-sidebar-accent text-sidebar-accent-foreground"
											: "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
									)}
									onClick={() => setIsOpen(false)}
								>
									<item.icon className="mr-3 h-5 w-5" />
									{item.name}
								</Link>
							);
						})}
					</nav>

					<div className="p-4 border-t border-sidebar-border">
						<div className="flex items-center mb-3">
							<div className="flex-1">
								<p className="text-sm font-medium text-sidebar-foreground">
									{user?.name}
								</p>
								<p className="text-xs text-muted-foreground">{user?.email}</p>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
							onClick={logout}
						>
							<LogOut className="mr-2 h-4 w-4" />
							Logout
						</Button>
					</div>
				</div>
			</div>

			{isOpen && (
				<div
					className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
					onClick={() => setIsOpen(false)}
				/>
			)}
		</>
	);
}
