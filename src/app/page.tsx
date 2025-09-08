"use client";

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form"; // Reverted import
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function HomePage() {
	const [isLogin, setIsLogin] = useState(true);
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user && !authLoading) {
			router.push("/dashboard");
		}
	}, [user, authLoading, router]);

	if (authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
					<p className="mt-2 text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	if (user) {
		return null; // Will redirect to dashboard
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-foreground">ProjectHub</h1>
					<p className="text-muted-foreground mt-2">
						Manage your projects and tasks efficiently
					</p>
				</div>

				<Card>
					<CardHeader className="text-center pb-2">
						<div className="flex rounded-lg bg-muted p-1">
							<Button
								variant={isLogin ? "default" : "ghost"}
								size="sm"
								className="flex-1"
								onClick={() => setIsLogin(true)}
							>
								Login
							</Button>
							<Button
								variant={!isLogin ? "default" : "ghost"}
								size="sm"
								className="flex-1"
								onClick={() => setIsLogin(false)}
							>
								Register
							</Button>
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						{isLogin ? <LoginForm /> : <RegisterForm />}
					</CardContent>
				</Card>
			</div>
			</div>
	);
}

