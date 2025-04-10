import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import {
  Building,
  Home as HomeIcon,
  MapPin,
  Map,
  Globe,
  UserPlus,
} from 'lucide-react';
import GoogleMapsIntegration from './google-maps-integration';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role: 'society' | 'community' | 'city' | 'country' | 'global' | 
        'society_admin' | 'community_admin' | 'city_admin' | 'country_admin' | 'global_admin';
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  managedEntities: any;
}

interface AdminPanelProps {
  societyId: number;
}

const AdminPanelSimplified: React.FC<AdminPanelProps> = ({ societyId }) => {
  // Basic state
  const [activeTab, setActiveTab] = useState('admins');
  const [adminRole, setAdminRole] = useState('society'); // Default is society level (masjid imam)
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch admin users based on role
  const { data: adminUsers, isLoading: adminsLoading } = useQuery<AdminUser[]>({
    queryFn: async () => {
      const res = await fetch(`/api/admins${adminRole ? `?level=${adminRole}` : ''}`);
      if (!res.ok) {
        throw new Error('Failed to fetch admin users');
      }
      return res.json();
    },
    queryKey: ['/api/admins', { role: adminRole }],
    enabled: activeTab === 'admins',
  });
  
  // Admin role types and their descriptions
  const adminRoles = [
    // Society level - Green
    {
      id: 'society',
      name: 'Society Admin',
      icon: <Building className="h-5 w-5" />,
      description: 'Masjid Imam level access - manage local society members and contributions',
      color: '#0C6E4E',
      level: 1
    },
    // Community level - Blue
    {
      id: 'community',
      name: 'Community Admin',
      icon: <HomeIcon className="h-5 w-5" />,
      description: 'Manage multiple societies within a community or area',
      color: '#2563EB',
      level: 2
    },
    // City level - Purple
    {
      id: 'city',
      name: 'City Admin',
      icon: <MapPin className="h-5 w-5" />,
      description: 'Oversee all communities within a city',
      color: '#9333EA',
      level: 3
    },
    // Country level - Red
    {
      id: 'country',
      name: 'Country Admin',
      icon: <Map className="h-5 w-5" />,
      description: 'Coordinate all cities within a country',
      color: '#E11D48',
      level: 4
    },
    // Global level - Black
    {
      id: 'global',
      name: 'Global Admin',
      icon: <Globe className="h-5 w-5" />,
      description: 'Worldwide system administration (United Nations level)',
      color: '#18181B',
      level: 5
    }
  ];

  return (
    <div className="space-y-6">
      <div 
        className="p-4 mb-6 rounded-lg"
        style={{ backgroundColor: `${adminRoles.find(role => role.id === adminRole)?.color}10`, borderLeft: `4px solid ${adminRoles.find(role => role.id === adminRole)?.color}` }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="p-3 rounded-full" 
            style={{ backgroundColor: `${adminRoles.find(role => role.id === adminRole)?.color}20` }}
          >
            {adminRoles.find(role => role.id === adminRole)?.icon}
          </div>
          <div>
            <h3 className="text-base font-medium mb-1">
              {adminRoles.find(role => role.id === adminRole)?.name} Dashboard
            </h3>
            <p className="text-sm text-muted-foreground">
              {adminRoles.find(role => role.id === adminRole)?.description}
            </p>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="admins" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            <span>Admin Management</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="admins">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Admin Management Column */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Admin Management ({adminRole.charAt(0).toUpperCase() + adminRole.slice(1)} Level)</CardTitle>
                    <CardDescription>
                      Manage administrator accounts at {adminRole} level
                    </CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Admin
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-4">
                    {adminRoles.map(role => (
                      <Button 
                        key={role.id}
                        variant={adminRole === role.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAdminRole(role.id)}
                        style={{ 
                          backgroundColor: adminRole === role.id ? role.color : 'transparent',
                          borderColor: role.color,
                          color: adminRole === role.id ? 'white' : role.color
                        }}
                      >
                        {role.icon}
                        <span className="ml-1">{role.name}</span>
                      </Button>
                    ))}
                  </div>
                  
                  {adminsLoading ? (
                    <div className="flex justify-center p-6">
                      <div className="animate-spin w-8 h-8 border-4 border-[#0C6E4E] border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-muted rounded-md">
                      <p className="text-muted-foreground">
                        {!adminUsers || adminUsers.length === 0 
                          ? "No admin accounts found at this level" 
                          : `${adminUsers.length} admin accounts found`}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Total {adminRole} admins: {adminUsers?.length || 0}
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            {/* Google Maps Integration Column */}
            <div className="lg:col-span-1">
              <GoogleMapsIntegration 
                adminRole={adminRole}
                adminLocations={adminUsers?.map(admin => ({
                  role: admin.role,
                  name: admin.name,
                  // Mock locations for demo - in production these would come from the database
                  lat: 30.3753 + (Math.random() * 2 - 1), 
                  lng: 69.3451 + (Math.random() * 2 - 1),
                  color: adminRoles.find(r => r.id === admin.role)?.color || '#0C6E4E'
                }))}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanelSimplified;