import { useState } from "react";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Mail, Lock } from "lucide-react";
import illustrationImage from "../assets/img/teacher-login.png";

const TeacherSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign in:", { email, password });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Sign In Form */}
      <div className="flex w-full md:w-5/12 items-center justify-center bg-background p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-lg border-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-lg border-input"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-colors"
            >
              Sign in
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't You Have An Account?{" "}
              <a href="#" className="text-primary font-medium hover:underline">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div
        className="hidden md:flex md:w-7/12 items-center justify-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(220 90% 50%), hsl(220 85% 55%))",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-12">
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome to <span className="block">Mutual Teachers' Portal</span>
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Connecting Teachers, Building Futures
          </p>

          <div className="mt-8 flex justify-center">
            <img
              src={illustrationImage}
              alt="Educational collaboration illustration"
              className="w-full max-w-2xl h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignIn;
