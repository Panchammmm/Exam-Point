
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

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { user, token } = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      login(user, token);

      toast({
        title: "Account created successfully!",
        description: `Welcome to ExamPortal, ${user.name}`
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" data-id="gydexdfiu" data-path="src/pages/auth/Signup.tsx">
      <div className="w-full max-w-md" data-id="vgcwef72p" data-path="src/pages/auth/Signup.tsx">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8" data-id="nrhv45m19" data-path="src/pages/auth/Signup.tsx">
          <BookOpen className="w-12 h-12 text-indigo-600 mr-3" data-id="uee9g3ei1" data-path="src/pages/auth/Signup.tsx" />
          <h1 className="text-3xl font-bold text-gray-900" data-id="06ue3cmrq" data-path="src/pages/auth/Signup.tsx">ExamPortal</h1>
        </div>

        <Card className="shadow-lg" data-id="k2x9l4z79" data-path="src/pages/auth/Signup.tsx">
          <CardHeader className="space-y-1" data-id="xihlmvloz" data-path="src/pages/auth/Signup.tsx">
            <CardTitle className="text-2xl text-center" data-id="zga7whuyj" data-path="src/pages/auth/Signup.tsx">Create Account</CardTitle>
            <CardDescription className="text-center" data-id="pdpcx14qw" data-path="src/pages/auth/Signup.tsx">
              Sign up to start taking exams
            </CardDescription>
          </CardHeader>
          <CardContent data-id="jszc50a3v" data-path="src/pages/auth/Signup.tsx">
            <form onSubmit={handleSubmit} className="space-y-4" data-id="ne5ujbvwm" data-path="src/pages/auth/Signup.tsx">
              {error &&
              <Alert variant="destructive" data-id="lgzvumeru" data-path="src/pages/auth/Signup.tsx">
                  <AlertDescription data-id="abgdgjmt9" data-path="src/pages/auth/Signup.tsx">{error}</AlertDescription>
                </Alert>
              }

              <div className="space-y-2" data-id="43syer57o" data-path="src/pages/auth/Signup.tsx">
                <Label htmlFor="name" data-id="xnxjv0jg2" data-path="src/pages/auth/Signup.tsx">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading} data-id="8z4fvne0c" data-path="src/pages/auth/Signup.tsx" />

              </div>

              <div className="space-y-2" data-id="76c4e987w" data-path="src/pages/auth/Signup.tsx">
                <Label htmlFor="email" data-id="gulj6egmd" data-path="src/pages/auth/Signup.tsx">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading} data-id="qqkyfgvas" data-path="src/pages/auth/Signup.tsx" />

              </div>

              <div className="space-y-2" data-id="kl72we4xh" data-path="src/pages/auth/Signup.tsx">
                <Label htmlFor="password" data-id="3ie1wxg9d" data-path="src/pages/auth/Signup.tsx">Password</Label>
                <div className="relative" data-id="pn3lm1ycq" data-path="src/pages/auth/Signup.tsx">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading} data-id="ctfmhdzku" data-path="src/pages/auth/Signup.tsx" />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading} data-id="llgcx2dlx" data-path="src/pages/auth/Signup.tsx">

                    {showPassword ?
                    <EyeOff className="h-4 w-4" data-id="kgjjhocnf" data-path="src/pages/auth/Signup.tsx" /> :

                    <Eye className="h-4 w-4" data-id="pliu5yzjw" data-path="src/pages/auth/Signup.tsx" />
                    }
                  </Button>
                </div>
              </div>

              <div className="space-y-2" data-id="fwcn37ybj" data-path="src/pages/auth/Signup.tsx">
                <Label htmlFor="confirmPassword" data-id="m3n4heinb" data-path="src/pages/auth/Signup.tsx">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading} data-id="2firxi87p" data-path="src/pages/auth/Signup.tsx" />

              </div>

              <Button type="submit" className="w-full" disabled={isLoading} data-id="irujiishc" data-path="src/pages/auth/Signup.tsx">
                {isLoading ? <LoadingSpinner size="sm" data-id="a8tehcfwp" data-path="src/pages/auth/Signup.tsx" /> : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center" data-id="z2h2mvb8l" data-path="src/pages/auth/Signup.tsx">
              <p className="text-sm text-gray-600" data-id="6r5m4nmb2" data-path="src/pages/auth/Signup.tsx">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:underline" data-id="5d4x3lx3u" data-path="src/pages/auth/Signup.tsx">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default Signup;