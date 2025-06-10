
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, token } = await authService.login({ email, password });
      login(user, token);

      toast({
        title: "Login successful!",
        description: `Welcome back, ${user.name}`
      });

      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" data-id="i3ut9iryj" data-path="src/pages/auth/Login.tsx">
      <div className="w-full max-w-md" data-id="upmtpyjt6" data-path="src/pages/auth/Login.tsx">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8" data-id="4stei6vjj" data-path="src/pages/auth/Login.tsx">
          <BookOpen className="w-12 h-12 text-indigo-600 mr-3" data-id="9y8je70x1" data-path="src/pages/auth/Login.tsx" />
          <h1 className="text-3xl font-bold text-gray-900" data-id="u4i8e65g1" data-path="src/pages/auth/Login.tsx">ExamPortal</h1>
        </div>

        <Card className="shadow-lg" data-id="otun6y6s0" data-path="src/pages/auth/Login.tsx">
          <CardHeader className="space-y-1" data-id="crzd0l7vm" data-path="src/pages/auth/Login.tsx">
            <CardTitle className="text-2xl text-center" data-id="0cwzgmlzh" data-path="src/pages/auth/Login.tsx">Sign In</CardTitle>
            <CardDescription className="text-center" data-id="lagriyeek" data-path="src/pages/auth/Login.tsx">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent data-id="pxpoo5par" data-path="src/pages/auth/Login.tsx">
            <form onSubmit={handleSubmit} className="space-y-4" data-id="eo8bzirft" data-path="src/pages/auth/Login.tsx">
              {error &&
              <Alert variant="destructive" data-id="7s5bhb0m8" data-path="src/pages/auth/Login.tsx">
                  <AlertDescription data-id="tbgei21e2" data-path="src/pages/auth/Login.tsx">{error}</AlertDescription>
                </Alert>
              }

              <div className="space-y-2" data-id="sqv5ixk64" data-path="src/pages/auth/Login.tsx">
                <Label htmlFor="email" data-id="crvcglxua" data-path="src/pages/auth/Login.tsx">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading} data-id="f7mvouibm" data-path="src/pages/auth/Login.tsx" />

              </div>

              <div className="space-y-2" data-id="chfku1sws" data-path="src/pages/auth/Login.tsx">
                <Label htmlFor="password" data-id="dyflaezdb" data-path="src/pages/auth/Login.tsx">Password</Label>
                <div className="relative" data-id="a9tj9lsvj" data-path="src/pages/auth/Login.tsx">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading} data-id="bezlnevlp" data-path="src/pages/auth/Login.tsx" />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading} data-id="6ti9waj94" data-path="src/pages/auth/Login.tsx">

                    {showPassword ?
                    <EyeOff className="h-4 w-4" data-id="66tjri0zk" data-path="src/pages/auth/Login.tsx" /> :

                    <Eye className="h-4 w-4" data-id="p8tyeii5y" data-path="src/pages/auth/Login.tsx" />
                    }
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading} data-id="yb0my0xvj" data-path="src/pages/auth/Login.tsx">
                {isLoading ? <LoadingSpinner size="sm" data-id="9t8dj8y9c" data-path="src/pages/auth/Login.tsx" /> : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2" data-id="cu4rp483v" data-path="src/pages/auth/Login.tsx">
              <p className="text-sm text-gray-600" data-id="m0zctqq5i" data-path="src/pages/auth/Login.tsx">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-600 hover:underline" data-id="0jb7s4wf0" data-path="src/pages/auth/Login.tsx">
                  Sign up
                </Link>
              </p>
              <p className="text-sm text-gray-600" data-id="m3p8wfrnq" data-path="src/pages/auth/Login.tsx">
                Are you an admin?{' '}
                <Link to="/admin/login" className="text-indigo-600 hover:underline" data-id="qo2es91kt" data-path="src/pages/auth/Login.tsx">
                  Admin Login
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg" data-id="x0x71evac" data-path="src/pages/auth/Login.tsx">
              <h3 className="text-sm font-semibold text-gray-700 mb-2" data-id="lni9zmwxt" data-path="src/pages/auth/Login.tsx">Demo Credentials:</h3>
              <div className="text-xs text-gray-600 space-y-1" data-id="9e2y0tiq9" data-path="src/pages/auth/Login.tsx">
                <p data-id="ecq222otl" data-path="src/pages/auth/Login.tsx"><strong data-id="c1et7uwm7" data-path="src/pages/auth/Login.tsx">User:</strong> user@example.com / password123</p>
                <p data-id="hgnz01b1i" data-path="src/pages/auth/Login.tsx"><strong data-id="njcipc7p4" data-path="src/pages/auth/Login.tsx">Admin:</strong> admin@example.com / admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default Login;