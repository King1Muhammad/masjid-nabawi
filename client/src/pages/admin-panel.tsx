import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageGenerator from "@/components/admin/ImageGenerator";
import { useState } from "react";

export default function AdminPanel() {
  const [generatedImagePath, setGeneratedImagePath] = useState<string | null>(null);

  const handleImageGenerated = (path: string) => {
    setGeneratedImagePath(path);
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-heading text-[#0C6E4E] mb-4">
              Admin Panel
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Manage your masjid website content, generate images, and configure site settings.
            </p>
          </div>

          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="images" className="text-lg">Images</TabsTrigger>
              <TabsTrigger value="content" className="text-lg">Content</TabsTrigger>
              <TabsTrigger value="settings" className="text-lg">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="images">
              <div className="grid md:grid-cols-2 gap-8">
                <ImageGenerator onImageGenerated={handleImageGenerated} />
                
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="text-2xl font-semibold mb-4 text-[#0C6E4E]">Image Library</h3>
                  
                  {generatedImagePath ? (
                    <div>
                      <p className="mb-4">Recently generated image:</p>
                      <div className="rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={generatedImagePath} 
                          alt="Generated" 
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Path: {generatedImagePath}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">
                        Generate an image to see it here
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">How to Use Generated Images:</h4>
                    <ol className="list-decimal list-inside text-gray-700 space-y-1 ml-2">
                      <li>Copy the image path from the image generator</li>
                      <li>Navigate to the page where you want to use the image</li>
                      <li>Replace the existing image path with your new generated image path</li>
                      <li>Save the file to see your new image on the site</li>
                    </ol>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-[#0C6E4E]">Content Management</h3>
                <p className="text-gray-600 mb-4">
                  This feature is coming soon. You'll be able to edit page content directly from this interface.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-[#0C6E4E]">Site Settings</h3>
                <p className="text-gray-600 mb-4">
                  This feature is coming soon. You'll be able to configure site-wide settings here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}