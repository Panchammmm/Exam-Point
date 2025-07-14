
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Eye, EyeOff, Shield } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
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
      const { user, token } = await authService.adminLogin({ email, password });
      login(user, token);

      toast({
        title: "Admin login successful!",
        description: `Welcome back, ${user.name}`
      });

      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4" data-id="aouwmn891" data-path="src/pages/auth/AdminLogin.tsx">
      <div className="w-full max-w-md" data-id="6g3k4drce" data-path="src/pages/auth/AdminLogin.tsx">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8" data-id="1q2vfgkqe" data-path="src/pages/auth/AdminLogin.tsx">
          <Shield className="w-12 h-12 text-red-600 mr-3" data-id="pkiy9x2aq" data-path="src/pages/auth/AdminLogin.tsx" />
          <h1 className="text-3xl font-bold text-gray-900" data-id="5l9xj8iz0" data-path="src/pages/auth/AdminLogin.tsx">Admin Portal</h1>
        </div>

        <Card className="shadow-lg border-red-200" data-id="jntrvcvos" data-path="src/pages/auth/AdminLogin.tsx">
          <CardHeader className="space-y-1 bg-red-50" data-id="fvu31h6ei" data-path="src/pages/auth/AdminLogin.tsx">
            <CardTitle className="text-2xl text-center text-red-700" data-id="sok6ymgid" data-path="src/pages/auth/AdminLogin.tsx">Admin Access</CardTitle>
            <CardDescription className="text-center text-red-600" data-id="jsalmhf60" data-path="src/pages/auth/AdminLogin.tsx">
              Restricted area - Admin credentials required
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6" data-id="m3y3tv631" data-path="src/pages/auth/AdminLogin.tsx">
            <form onSubmit={handleSubmit} className="space-y-4" data-id="l5es2xs67" data-path="src/pages/auth/AdminLogin.tsx">
              {error &&
              <Alert variant="destructive" data-id="agbbbiuhn" data-path="src/pages/auth/AdminLogin.tsx">
                  <AlertDescription data-id="r04m7jijg" data-path="src/pages/auth/AdminLogin.tsx">{error}</AlertDescription>
                </Alert>
              }

              <div className="space-y-2" data-id="w4386auj0" data-path="src/pages/auth/AdminLogin.tsx">
                <Label htmlFor="email" data-id="ao5m7vwxr" data-path="src/pages/auth/AdminLogin.tsx">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading} data-id="gkpren4nn" data-path="src/pages/auth/AdminLogin.tsx" />

              </div>

              <div className="space-y-2" data-id="gtol7991e" data-path="src/pages/auth/AdminLogin.tsx">
                <Label htmlFor="password" data-id="93lopufjf" data-path="src/pages/auth/AdminLogin.tsx">Admin Password</Label>
                <div className="relative" data-id="l5u5xcdnk" data-path="src/pages/auth/AdminLogin.tsx">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading} data-id="xx28hq4l6" data-path="src/pages/auth/AdminLogin.tsx" />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading} data-id="59et4b1ks" data-path="src/pages/auth/AdminLogin.tsx">

                    {showPassword ?
                    <EyeOff className="h-4 w-4" data-id="7ngjtnycx" data-path="src/pages/auth/AdminLogin.tsx" /> :

                    <Eye className="h-4 w-4" data-id="u8oei5uga" data-path="src/pages/auth/AdminLogin.tsx" />
                    }
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading} data-id="omikwnm18" data-path="src/pages/auth/AdminLogin.tsx">

                {isLoading ? <LoadingSpinner size="sm" data-id="p7p4ytit7" data-path="src/pages/auth/AdminLogin.tsx" /> : 'Admin Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center" data-id="h03meizxz" data-path="src/pages/auth/AdminLogin.tsx">
              <p className="text-sm text-gray-600" data-id="1e2bbyij8" data-path="src/pages/auth/AdminLogin.tsx">
                Not an admin?{' '}
                <Link to="/login" className="text-indigo-600 hover:underline" data-id="wit6xar1y" data-path="src/pages/auth/AdminLogin.tsx">
                  User Login
                </Link>
              </p>
            </div>

            {/* Demo Admin Credentials */}
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200" data-id="lbf7uwbng" data-path="src/pages/auth/AdminLogin.tsx">
              <h3 className="text-sm font-semibold text-red-700 mb-2" data-id="9rb1r9efl" data-path="src/pages/auth/AdminLogin.tsx">Demo Admin Credentials:</h3>
              <div className="text-xs text-red-600" data-id="ryauyebvd" data-path="src/pages/auth/AdminLogin.tsx">
                <p data-id="7paaghzd7" data-path="src/pages/auth/AdminLogin.tsx"><strong data-id="835rydle2" data-path="src/pages/auth/AdminLogin.tsx">Email:</strong> admin@example.com</p>
                <p data-id="sfqm6ld84" data-path="src/pages/auth/AdminLogin.tsx"><strong data-id="a5di0x68d" data-path="src/pages/auth/AdminLogin.tsx">Password:</strong> admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default AdminLogin;