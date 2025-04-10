import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Map, Globe } from 'lucide-react';

interface AdminLocation {
  role: string;
  name: string;
  lat?: number; 
  lng?: number;
  color: string;
}

interface GoogleMapsIntegrationProps {
  adminRole?: string;
  adminLocations?: AdminLocation[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMapsIntegration: React.FC<GoogleMapsIntegrationProps> = ({
  adminRole = 'global_admin',
  adminLocations = [],
  centerLat = 30.3753, // Default to center of the world
  centerLng = 69.3451, // (roughly Pakistan)
  zoom = 3
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Role-based map styling and defaults
  const getMapStyle = () => {
    switch (adminRole) {
      case 'society_admin':
      case 'society':
        return { zoom: 16, color: '#0C6E4E' }; // Green, very local view
      case 'community_admin':
      case 'community':
        return { zoom: 14, color: '#2563EB' }; // Blue, neighborhood view
      case 'city_admin':
      case 'city':
        return { zoom: 11, color: '#9333EA' }; // Purple, city view
      case 'country_admin':
      case 'country':
        return { zoom: 5, color: '#E11D48' }; // Red, country view
      case 'global_admin':
      case 'global':
      default:
        return { zoom: 2, color: '#18181B' }; // Black, world view
    }
  };

  // Initialize the map
  useEffect(() => {
    // Define initialization function
    window.initMap = () => {
      if (!mapRef.current) return;

      const mapStyle = getMapStyle();
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: zoom || mapStyle.zoom,
        styles: [
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: mapStyle.color }]
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: `${mapStyle.color}10` }]
          }
        ]
      });
      
      setMap(mapInstance);
      setIsLoaded(true);
    };

    // Load Google Maps API - NOTE: For demo purposes only, using a placeholder div
    // In a production environment, you would use a proper Google Maps API key
    
    // Simulate map loading for demo
    setTimeout(() => {
      if (mapRef.current) {
        const demoMap = document.createElement('div');
        demoMap.className = 'h-full w-full flex flex-col items-center justify-center bg-gray-100 rounded';
        demoMap.innerHTML = `
          <div class="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${getMapStyle().color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M12 21l-8-8a6 6 0 0 1 0-8.5 6 6 0 0 1 8.5 0 6 6 0 0 1 0 8.5L12 21z"></path>
            </svg>
            <h3 class="mt-2 text-lg font-medium" style="color: ${getMapStyle().color}">Admin Map View - ${adminRole} Level</h3>
            <p class="mt-1 text-sm text-gray-500">Geographic visualization for ${adminLocations?.length || 0} admin locations</p>
            <div class="mt-4 grid grid-cols-2 gap-2">
              ${adminLocations?.map((loc, i) => `
                <div class="text-sm p-2 rounded flex items-center" style="background-color: ${loc.color}20; color: ${loc.color}">
                  <span class="inline-block w-3 h-3 mr-2 rounded-full" style="background-color: ${loc.color}"></span>
                  ${loc.name}
                </div>
              `).join('') || ''}
            </div>
          </div>
        `;
        
        // Clear the mapRef and append the demo element
        while (mapRef.current.firstChild) {
          mapRef.current.removeChild(mapRef.current.firstChild);
        }
        mapRef.current.appendChild(demoMap);
        
        setIsLoaded(true);
      }
    }, 1500);
  }, [adminRole, centerLat, centerLng, zoom]);

  // Add markers for admin locations
  useEffect(() => {
    if (!isLoaded || !map || !window.google) return;
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: any[] = [];
    
    // Add new markers
    adminLocations.forEach((location) => {
      if (!location.lat || !location.lng) return;
      
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: `${location.name} (${location.role})`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: location.color || getMapStyle().color,
          fillOpacity: 0.8,
          strokeWeight: 2,
          strokeColor: 'white',
          scale: 8
        }
      });
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <strong>${location.name}</strong>
            <p style="margin: 4px 0 0 0;">${location.role}</p>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      
      newMarkers.push(marker);
    });
    
    setMarkers(newMarkers);
  }, [isLoaded, map, adminLocations]);

  // Handle search
  const handleSearch = () => {
    if (!isLoaded || !map || !window.google || !searchQuery) return;
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results: any, status: string) => {
      if (status === 'OK' && results[0]) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(10); // Zoom in to found location
        
        // Add marker for the searched location
        const marker = new window.google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          title: searchQuery,
          animation: window.google.maps.Animation.DROP
        });
        
        markers.push(marker);
        setMarkers([...markers]);
      }
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          <span>Admin Geographical View</span>
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            <MapPin className="h-4 w-4 mr-2" />
            Find
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isLoaded && (
          <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
        <div 
          ref={mapRef} 
          className="h-[400px] w-full rounded-md overflow-hidden"
          style={{ display: isLoaded ? 'block' : 'none' }}
        ></div>
        
        {isLoaded && (
          <div className="mt-4 flex flex-wrap gap-2">
            <p className="text-sm text-muted-foreground w-full mb-1">Admin Hierarchy Legend:</p>
            {['Society Admin', 'Community Admin', 'City Admin', 'Country Admin', 'Global Admin'].map((role, index) => {
              const colors = ['#0C6E4E', '#2563EB', '#9333EA', '#E11D48', '#18181B'];
              return (
                <div 
                  key={role} 
                  className="flex items-center text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${colors[index]}15`,
                    color: colors[index],
                    borderLeft: `3px solid ${colors[index]}`
                  }}
                >
                  <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: colors[index] }}></span>
                  {role}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleMapsIntegration;