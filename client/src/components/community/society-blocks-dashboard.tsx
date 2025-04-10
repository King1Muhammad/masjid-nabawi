import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Home, 
  Users,
  DollarSign,
  Calendar,
  Loader2 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Flat {
  id: number;
  blockId: number;
  flatNumber: string;
  status: 'occupied' | 'vacant';
  paymentStatus: 'paid' | 'unpaid' | 'na';
  ownerName?: string;
  lastPaymentDate?: string;
}

interface Block {
  id: number;
  societyId: number;
  blockName: string;
  flatsCount: number;
  createdAt: string;
  flats?: Flat[];
}

export default function SocietyBlocksDashboard() {
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  
  // Fetch all blocks for the society
  const { data: blocks, isLoading, error } = useQuery<Block[]>({
    queryKey: ['/api/society/1/blocks'],
    queryFn: async () => {
      const res = await fetch('/api/society/1/blocks');
      if (!res.ok) {
        throw new Error('Failed to fetch blocks');
      }
      return res.json();
    }
  });
  
  // Generate dummy flats data for demonstration
  const [flatsList, setFlatsList] = useState<Record<string, Flat[]>>({});
  
  useEffect(() => {
    if (blocks && blocks.length > 0) {
      // Set the first block as active by default
      if (!activeBlock) {
        setActiveBlock(blocks[0].blockName);
      }
      
      // Generate flats for each block
      const flatsData: Record<string, Flat[]> = {};
      blocks.forEach(block => {
        const blockFlats: Flat[] = [];
        for (let i = 1; i <= block.flatsCount; i++) {
          // Randomize status for demonstration
          const isOccupied = Math.random() > 0.2; // 80% occupied
          const isPaid = isOccupied ? Math.random() > 0.3 : false; // 70% of occupied flats are paid
          
          blockFlats.push({
            id: i,
            blockId: block.id,
            flatNumber: i.toString(),
            status: isOccupied ? 'occupied' : 'vacant',
            paymentStatus: !isOccupied ? 'na' : (isPaid ? 'paid' : 'unpaid'),
            ownerName: isOccupied ? `Resident ${i}` : undefined,
            lastPaymentDate: isPaid ? new Date().toISOString() : undefined
          });
        }
        flatsData[block.blockName] = blockFlats;
      });
      
      setFlatsList(flatsData);
    }
  }, [blocks, activeBlock]);
  
  // Calculate summary statistics
  const calculateStats = () => {
    if (!blocks || !Object.keys(flatsList).length) return null;
    
    let totalFlats = 0;
    let occupiedFlats = 0;
    let paidFlats = 0;
    let unpaidFlats = 0;
    
    Object.values(flatsList).forEach(flats => {
      totalFlats += flats.length;
      
      flats.forEach(flat => {
        if (flat.status === 'occupied') {
          occupiedFlats++;
          if (flat.paymentStatus === 'paid') {
            paidFlats++;
          } else if (flat.paymentStatus === 'unpaid') {
            unpaidFlats++;
          }
        }
      });
    });
    
    return {
      totalFlats,
      occupiedFlats,
      vacantFlats: totalFlats - occupiedFlats,
      paidFlats,
      unpaidFlats,
      occupancyRate: Math.round((occupiedFlats / totalFlats) * 100),
      paymentRate: occupiedFlats > 0 ? Math.round((paidFlats / occupiedFlats) * 100) : 0
    };
  };
  
  const stats = calculateStats();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-600">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">Error loading society blocks</p>
        </div>
        <p className="text-sm mt-1">{(error as Error).message}</p>
      </div>
    );
  }
  
  // No blocks found
  if (!blocks || blocks.length === 0) {
    return (
      <div className="p-6 border rounded-md bg-gray-50 text-center">
        <Home className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <h3 className="text-lg font-medium">No Blocks Found</h3>
        <p className="text-gray-500 mt-1">No society blocks have been configured yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blocks.length}</div>
            <p className="text-xs text-muted-foreground">
              D-1 to D-{blocks.length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.occupancyRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.occupiedFlats || 0} of {stats?.totalFlats || 0} flats occupied
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.paymentRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.paidFlats || 0} of {stats?.occupiedFlats || 0} paid this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Collection Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {(stats?.paidFlats || 0) * 1500}</div>
            <p className="text-xs text-muted-foreground">
              PKR {(stats?.unpaidFlats || 0) * 1500} remaining
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Society Blocks</CardTitle>
          <CardDescription>
            View and manage all blocks and flats in the society
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeBlock || ''} onValueChange={setActiveBlock}>
            <div className="mb-6 overflow-auto pb-2">
              <TabsList className="h-auto inline-flex flex-nowrap min-w-max">
                {blocks.map(block => (
                  <TabsTrigger
                    key={block.id}
                    value={block.blockName}
                    className="px-3 py-1.5"
                  >
                    {block.blockName}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {blocks.map(block => (
              <TabsContent key={block.id} value={block.blockName} className="space-y-4">
                <div className="flex flex-wrap gap-3 p-2 pb-6">
                  <Badge variant="outline" className="gap-1 border-primary/20 bg-primary/5">
                    <Home className="h-3 w-3 text-primary" /> Block {block.blockName}
                  </Badge>
                  <Badge variant="outline" className="gap-1 border-primary/20 bg-primary/5">
                    <Users className="h-3 w-3 text-primary" /> {block.flatsCount} Flats
                  </Badge>
                  <Badge variant="outline" className="gap-1 border-primary/20 bg-primary/5">
                    <Calendar className="h-3 w-3 text-primary" /> Added on {new Date(block.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {flatsList[block.blockName]?.map(flat => (
                    <TooltipProvider key={flat.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`border rounded-md p-4 text-center cursor-pointer transition-all hover:shadow-md
                              ${flat.status === 'vacant' ? 'bg-gray-100 border-gray-300' : 
                                flat.paymentStatus === 'paid' ? 'bg-green-50 border-green-200' : 
                                'bg-red-50 border-red-200'}`}
                          >
                            <div className="flex justify-center mb-2">
                              {flat.status === 'vacant' ? (
                                <Home className="h-6 w-6 text-gray-400" />
                              ) : flat.paymentStatus === 'paid' ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              ) : (
                                <XCircle className="h-6 w-6 text-red-500" />
                              )}
                            </div>
                            <h3 className="font-medium">
                              {block.blockName}-{flat.flatNumber}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {flat.status === 'vacant' ? 'Vacant' : 
                                flat.ownerName || 'Resident'}
                            </p>
                            {flat.status !== 'vacant' && (
                              <Badge 
                                variant={flat.paymentStatus === 'paid' ? 'default' : 'destructive'}
                                className="mt-2 text-xs"
                              >
                                {flat.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                              </Badge>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            <p className="font-medium">{block.blockName}-{flat.flatNumber}</p>
                            {flat.status === 'occupied' ? (
                              <>
                                <p>Owner: {flat.ownerName}</p>
                                <p>Status: {flat.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</p>
                                {flat.paymentStatus === 'paid' && flat.lastPaymentDate && (
                                  <p>Last Payment: {new Date(flat.lastPaymentDate).toLocaleDateString()}</p>
                                )}
                              </>
                            ) : (
                              <p>Status: Vacant</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <DollarSign className="h-4 w-4" /> Record Payments
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-muted-foreground mt-4">
        <p>
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span> Green: Paid
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mx-1 ml-3"></span> Red: Unpaid
          <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mx-1 ml-3"></span> Gray: Vacant
        </p>
      </div>
    </div>
  );
}