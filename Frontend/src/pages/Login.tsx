import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import ucLogo from "@/assets/uc-logo.png";
import ccsLogo from "@/assets/ccs-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, role, user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      // Role will be fetched by AuthContext, redirect handled by effect
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-redirect when role is loaded after sign in
  useEffect(() => {
    if (user && role) {
      navigate(`/${role}`, { replace: true });
    }
  }, [user, role, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors duration-300">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23295D66' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logos */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <img src={ucLogo} alt="University of Cabuyao" className="w-16 h-16 object-contain transition-transform duration-300 hover:scale-110" />
          <div className="text-center">
            <h2 className="text-xs font-medium text-muted-foreground tracking-wider uppercase">University of Cabuyao</h2>
            <h1 className="text-lg font-display font-bold text-secondary">College of Computing Studies</h1>
          </div>
          <img src={ccsLogo} alt="CCS Logo" className="w-16 h-16 object-contain transition-transform duration-300 hover:scale-110" />
        </div>

        <Card className="border-0 shadow-xl shadow-secondary/10 transition-shadow duration-300 hover:shadow-2xl hover:shadow-secondary/20">
          <CardHeader className="text-center pb-2 pt-6">
            <h2 className="text-2xl font-display font-bold text-foreground">CCS Profiling System</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your account
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@uc.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="transition-all duration-200 focus:scale-[1.01]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>
            <p className="text-center text-xs text-muted-foreground mt-6">
              Pamantasan ng Cabuyao &bull; BSIT Department
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
