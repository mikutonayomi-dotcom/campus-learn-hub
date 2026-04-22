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
import pncBackground from "@/assets/PNC-background.jpg";
import ccsBackground from "@/assets/CCS-background.jpg";

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

  useEffect(() => {
    if (user && role) {
      navigate(`/${role}`, { replace: true });
    }
  }, [user, role, navigate]);

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Side - PNC Background */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative"
        style={{
          backgroundImage: `url(${pncBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#12B7BA]/60 to-[#295D66]/50" />
        <div className="relative z-10 flex flex-col justify-center items-center p-8 pl-16 text-white animate-slide-in-left">
          <img src={ucLogo} alt="University of Cabuyao" className="w-32 h-32 object-contain mb-8 drop-shadow-lg" />
          <h1 className="text-4xl font-display font-bold text-center mb-3">Pamantasan ng Cabuyao</h1>
          <p className="text-xl text-white/90 text-center">University of Cabuyao</p>
          <div className="mt-10 w-28 h-1.5 bg-white/50 rounded-full" />
          <p className="mt-10 text-base text-white/80 text-center max-w-sm">
            Empowering students through quality education and innovative learning experiences.
          </p>
        </div>
      </div>

      {/* Right Side - CCS Background with Login Card */}
      <div 
        className="flex-1 lg:w-1/2 relative flex items-center justify-center p-4"
        style={{
          backgroundImage: `url(${ccsBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#EEF9FC]/95 dark:bg-[#1a3d42]/95 backdrop-blur-sm" />
        
        <div className="relative z-10 w-full max-w-md animate-slide-in-right">
          {/* Mobile Logos */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <img src={ucLogo} alt="University of Cabuyao" className="w-14 h-14 object-contain" />
            <div className="h-10 w-px bg-primary/30" />
            <img src={ccsLogo} alt="CCS Logo" className="w-14 h-14 object-contain" />
          </div>

          {/* Header for mobile */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-xl font-display font-bold text-foreground">Pamantasan ng Cabuyao</h1>
            <p className="text-sm text-muted-foreground">College of Computing Studies</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-center gap-4 mb-6">
            <img src={ccsLogo} alt="CCS Logo" className="w-16 h-16 object-contain transition-transform duration-300 hover:scale-110" />
            <div className="text-center">
              <h2 className="text-xs font-medium text-muted-foreground tracking-wider uppercase">College of</h2>
              <h1 className="text-xl font-display font-bold text-primary">Computing Studies</h1>
            </div>
          </div>

          <Card className="border-0 shadow-2xl shadow-[#295D66]/20 bg-white/90 dark:bg-[#0f292d]/90 backdrop-blur-md overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#12B7BA] via-[#295D66] to-[#78E44E]" />
            <CardHeader className="text-center pb-2 pt-6">
              <h2 className="text-2xl font-display font-bold text-foreground">CCS Profiling System</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in to your account
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@uc.edu.ph"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 transition-all duration-200 focus:scale-[1.01] border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 transition-all duration-200 focus:scale-[1.01] border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  className="w-full h-11 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-[#0EA5A8]/80 to-[#0D9295]/80 hover:from-[#0D9295]/80 hover:to-[#0EA5A8]/80 text-white/90 shadow-lg shadow-[#12B7BA]/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              
              <div className="mt-6 pt-4 border-t border-border/50">
                <p className="text-center text-xs text-muted-foreground">
                  BSIT Department &bull; Student Profiling Management System
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground/60 mt-6">
            &copy; {new Date().getFullYear()} University of Cabuyao. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
