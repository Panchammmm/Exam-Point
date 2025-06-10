
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger } from
'@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, BookOpen, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name.
    split(' ').
    map((n) => n[0]).
    join('').
    toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" data-id="7rjwpm8u0" data-path="src/components/Layout.tsx">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b" data-id="ld20w7rqm" data-path="src/components/Layout.tsx">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-id="73wfkl9pa" data-path="src/components/Layout.tsx">
          <div className="flex justify-between items-center h-16" data-id="zueti3olz" data-path="src/components/Layout.tsx">
            {/* Logo */}
            <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center space-x-2" data-id="uw1nxeuij" data-path="src/components/Layout.tsx">
              <BookOpen className="w-8 h-8 text-indigo-600" data-id="d8h0kioay" data-path="src/components/Layout.tsx" />
              <span className="text-xl font-bold text-gray-900" data-id="1j9ri4k4s" data-path="src/components/Layout.tsx">ExamPortal</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4" data-id="avrf2hj8m" data-path="src/components/Layout.tsx">
              {user?.role === 'admin' ?
              <>
                  <Link to="/admin" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" data-id="6r4hh4a6c" data-path="src/components/Layout.tsx">
                    Dashboard
                  </Link>
                  <Link to="/admin/exams" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" data-id="2hrybasg5" data-path="src/components/Layout.tsx">
                    Manage Exams
                  </Link>
                  <Link to="/admin/create-exam" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" data-id="fev74geqw" data-path="src/components/Layout.tsx">
                    Create Exam
                  </Link>
                </> :

              <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" data-id="hoarwbsgs" data-path="src/components/Layout.tsx">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" data-id="9nmclcurf" data-path="src/components/Layout.tsx">
                    Profile
                  </Link>
                </>
              }

              {/* User Menu */}
              <DropdownMenu data-id="kmcouo29f" data-path="src/components/Layout.tsx">
                <DropdownMenuTrigger asChild data-id="j9kda1oem" data-path="src/components/Layout.tsx">
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-id="eptv5n9p8" data-path="src/components/Layout.tsx">
                    <Avatar className="h-8 w-8" data-id="t50u0uaf3" data-path="src/components/Layout.tsx">
                      <AvatarFallback className="bg-indigo-500 text-white" data-id="j5o0xyyfb" data-path="src/components/Layout.tsx">
                        {user ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount data-id="64jt9pdl8" data-path="src/components/Layout.tsx">
                  <DropdownMenuItem className="flex flex-col items-start p-2" data-id="coy6j4jdd" data-path="src/components/Layout.tsx">
                    <div className="text-sm font-medium" data-id="980icoia9" data-path="src/components/Layout.tsx">{user?.name}</div>
                    <div className="text-xs text-gray-500" data-id="lpaxye6r7" data-path="src/components/Layout.tsx">{user?.email}</div>
                    <div className="text-xs text-indigo-600 capitalize" data-id="5sgricxe6" data-path="src/components/Layout.tsx">{user?.role}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} data-id="p7e6ypk5u" data-path="src/components/Layout.tsx">
                    <User className="mr-2 h-4 w-4" data-id="ong7nidbo" data-path="src/components/Layout.tsx" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} data-id="zwnnovqgc" data-path="src/components/Layout.tsx">
                    <LogOut className="mr-2 h-4 w-4" data-id="j8ktbwghc" data-path="src/components/Layout.tsx" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-id="7qyb6aqxs" data-path="src/components/Layout.tsx">
        {children}
      </main>
    </div>);

};

export default Layout;