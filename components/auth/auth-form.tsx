"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { BookOpen, Eye, EyeOff, Lock, Mail, PenTool, User } from "lucide-react";

import { signupAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [signinError, setSigninError] = useState("");

  async function handleSignin(formData: FormData) {
    setSigninError("");

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setSigninError("Invalid email or password");
      return;
    }

    window.location.href = "/onboarding/username";
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to WriteSpace</CardTitle>
          <CardDescription>Sign in or create your account</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form action={handleSignin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input name="email" type="email" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {signinError && (
                  <p className="text-sm text-destructive">{signinError}</p>
                )}

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form action={signupAction} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input name="name" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input name="email" type="email" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input name="password" type="password" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>I want to join as:</Label>
                  <RadioGroup defaultValue="READER" name="role">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="READER" id="reader" />
                      <Label htmlFor="reader" className="flex cursor-pointer items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Reader
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PUBLISHER" id="publisher" />
                      <Label htmlFor="publisher" className="flex cursor-pointer items-center gap-2">
                        <PenTool className="h-4 w-4" />
                        Publisher
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and privacy policy
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}