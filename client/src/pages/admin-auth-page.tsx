import { useState } from 'react';
import { useLocation, useRoute, useRouter } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, AlertCircle, Lock, User, Mail, Globe, Building, MapPin, Map, LibraryBig } from 'lucide-react';

// Define form schemas
const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
});

const registerSchema = z.object({
  name: z.string().min(3, { message: "Full name is required" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscore"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  role: z.enum(['society', 'community', 'city', 'country', 'global'])
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AdminAuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const [, setLocation] = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Form setup for login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // Form setup for registration
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'society'
    }
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      const res = await apiRequest('POST', '/api/admin/login', credentials);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['/api/admin/current'], user);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      // Redirect to admin dashboard
      setLocation('/admin');
    },
    onError: (error: Error) => {
      setLoginError(error.message);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterFormValues) => {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...dataToSend } = userData;
      
      const res = await apiRequest('POST', '/api/admin/register', dataToSend);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
      }
      return await res.json();
    },
    onSuccess: (user) => {
      toast({
        title: "Registration Successful",
        description: "Your admin account has been created and is pending approval.",
      });
      // Switch to login view after successful registration
      setIsLoginView(true);
    },
    onError: (error: Error) => {
      setRegisterError(error.message);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Form submission handlers
  const onLoginSubmit = (data: LoginFormValues) => {
    setLoginError(null);
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    setRegisterError(null);
    registerMutation.mutate(data);
  };

  // Admin role types with their icons and descriptions
  const adminRoles = [
    {
      id: 'society',
      name: 'Society Admin',
      icon: <Building className="h-5 w-5" />,
      description: 'Masjid Imam level access',
      color: '#0C6E4E'
    },
    {
      id: 'community',
      name: 'Community Admin',
      icon: <LibraryBig className="h-5 w-5" />,
      description: 'Manage multiple societies',
      color: '#2563EB'
    },
    {
      id: 'city',
      name: 'City Admin',
      icon: <MapPin className="h-5 w-5" />,
      description: 'Oversee communities in a city',
      color: '#9333EA'
    },
    {
      id: 'country',
      name: 'Country Admin',
      icon: <Map className="h-5 w-5" />,
      description: 'Coordinate all cities',
      color: '#E11D48'
    },
    {
      id: 'global',
      name: 'Global Admin',
      icon: <Globe className="h-5 w-5" />,
      description: 'Worldwide administration',
      color: '#18181B'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Forms */}
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 text-primary mb-2">
              <ShieldCheck className="h-6 w-6" />
              <CardTitle className="text-2xl">Administrator Portal</CardTitle>
            </div>
            <CardDescription>
              Manage community governance, financial oversight, and member services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={isLoginView ? "login" : "register"} onValueChange={(value) => setIsLoginView(value === "login")}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                {loginError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Login Error</AlertTitle>
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Enter your username" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" type="password" placeholder="Enter your password" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                {registerError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Registration Error</AlertTitle>
                    <AlertDescription>{registerError}</AlertDescription>
                  </Alert>
                )}
                
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" placeholder="Create a username" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" type="email" placeholder="Enter your email" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" type="password" placeholder="Create a password" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Role</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mt-2">
                            {adminRoles.map(role => (
                              <div 
                                key={role.id}
                                onClick={() => registerForm.setValue('role', role.id as any)}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50
                                  ${field.value === role.id 
                                    ? `border-[${role.color}] bg-opacity-10 bg-[${role.color}]` 
                                    : 'border-gray-200'
                                  }`}
                                style={{
                                  borderColor: field.value === role.id ? role.color : '',
                                  backgroundColor: field.value === role.id ? `${role.color}10` : ''
                                }}
                              >
                                <div className="p-2 rounded-full" style={{ color: role.color }}>
                                  {role.icon}
                                </div>
                                <span className="text-sm font-medium mt-1">{role.name}</span>
                                <span className="text-xs text-center text-gray-500 mt-1">{role.description}</span>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-6" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Registering..." : "Register Admin Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Your registration will be reviewed by a higher-level administrator before approval.
            </p>
          </CardFooter>
        </Card>
        
        {/* Right side - Info */}
        <div className="hidden lg:flex flex-col justify-center space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">Admin Hierarchy System</h2>
            <p className="text-gray-600 mb-6">
              Our comprehensive five-level administration system ensures proper governance and management at every level, from individual masjids to global coordination.
            </p>
            
            <div className="space-y-4">
              {adminRoles.map(role => (
                <div key={role.id} className="flex items-start gap-3">
                  <div className="p-2 rounded-full" style={{ color: role.color }}>
                    {role.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: role.color }}>{role.name}</h3>
                    <p className="text-sm text-gray-600">
                      {role.id === 'society' && 'Manages individual masjid affairs, member registrations, and local contributions.'}
                      {role.id === 'community' && 'Coordinates multiple masjids within a neighborhood, facilitating resource sharing and joint activities.'}
                      {role.id === 'city' && 'Oversees all communities within a city, promoting standardized practices and unified objectives.'}
                      {role.id === 'country' && 'Administers city-level coordination, ensuring alignment with national regulations and goals.'}
                      {role.id === 'global' && 'Provides worldwide leadership, vision, and strategic direction for the entire network.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Alert className="bg-primary/10 border-primary/20">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Democratic Governance</AlertTitle>
            <AlertDescription className="text-gray-600">
              Each administrative level operates under democratic principles, with decisions made through voting and consensus among community members.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}