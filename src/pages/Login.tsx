import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ruppLogo from "@/assets/rupp-logo.png";
import ruppBuilding from "@/assets/rupp-building.png";

const Login = () => {
  const { login, signup, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading your account...</div>
      </div>
    );
  }
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      toast({ title: "Login failed", description: "Invalid email or password.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await signup(email, password, name, role);
      toast({ title: "Account created!", description: "You can now sign in with your credentials." });
      setMode("login");
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Building photo */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={ruppBuilding}
          alt="Royal University of Phnom Penh building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 sm:p-8">
        <div className="w-full max-w-[440px]">
          <div className="bg-card rounded-2xl shadow-elevated p-8 sm:p-10 border border-border/40">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img src={ruppLogo} alt="RUPP Logo" width={100} height={100} className="object-contain" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-extrabold text-foreground text-center tracking-wide">
              RUPPER CONNECT
            </h1>
            <div className="w-24 h-1 bg-destructive mx-auto mt-2 mb-6 rounded-full" />

            {/* Mode heading */}
            <h2 className="text-lg font-semibold text-foreground text-center mb-5">
              {mode === "login" ? "Log In" : "Register"}
            </h2>

            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-sm text-muted-foreground">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Email"
                    className="h-11 bg-muted/50 border-border/60"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password" className="text-sm text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="h-11 bg-muted/50 border-border/60 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button type="button" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-bold text-base bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg"
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Log In
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setMode("register")} className="text-destructive font-semibold hover:underline">
                    Register
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name" className="text-sm text-muted-foreground">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Full Name"
                    className="h-11 bg-muted/50 border-border/60"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-sm text-muted-foreground">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Email"
                    className="h-11 bg-muted/50 border-border/60"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-sm text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="h-11 bg-muted/50 border-border/60 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">I am a</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                    <SelectTrigger className="h-11 bg-muted/50 border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-bold text-base bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg"
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setMode("login")} className="text-destructive font-semibold hover:underline">
                    Log In
                  </button>
                </p>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            © {new Date().getFullYear()} Royal University of Phnom Penh
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
