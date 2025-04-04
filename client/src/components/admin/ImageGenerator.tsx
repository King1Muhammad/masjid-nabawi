import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ImageGeneratorProps {
  onImageGenerated?: (imagePath: string) => void;
}

export const ImageGenerator = ({ onImageGenerated }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [filename, setFilename] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    if (!prompt || !filename) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both a prompt and filename',
        variant: 'destructive',
      });
      return;
    }

    // Add .jpg extension if not present
    const finalFilename = filename.endsWith('.jpg') || filename.endsWith('.png') 
      ? filename 
      : `${filename}.jpg`;

    setIsGenerating(true);
    try {
      const response = await apiRequest('POST', '/api/generate-image', {
        prompt,
        filename: finalFilename,
      });

      const data = await response.json();
      
      if (response.ok) {
        setGeneratedImageUrl(data.path);
        toast({
          title: 'Image Generated!',
          description: 'The image was generated successfully',
        });
        
        if (onImageGenerated) {
          onImageGenerated(data.path);
        }
      } else {
        toast({
          title: 'Generation Failed',
          description: data.message || 'Failed to generate image',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong while generating the image',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateThemedImages = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest('POST', '/api/generate-themed-images', {});
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Themed Images Generated!',
          description: 'All themed images were generated successfully',
        });
        
        // Just use the first image as preview if available
        const firstImagePath = Object.values(data.paths)[0] as string;
        if (firstImagePath) {
          setGeneratedImageUrl(firstImagePath);
          
          if (onImageGenerated) {
            onImageGenerated(firstImagePath);
          }
        }
      } else {
        toast({
          title: 'Generation Failed',
          description: data.message || 'Failed to generate themed images',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong while generating themed images',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-[#0C6E4E]">AI Image Generator</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" htmlFor="prompt">
          Image Description
        </label>
        <Textarea
          id="prompt"
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" htmlFor="filename">
          Filename
        </label>
        <Input
          id="filename"
          placeholder="e.g., masjid-exterior"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          The extension .jpg will be added automatically if not provided
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Button 
          onClick={handleGenerateImage} 
          disabled={isGenerating}
          className="bg-[#0C6E4E] hover:bg-[#0C6E4E]/90"
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </Button>
        
        <Button 
          onClick={handleGenerateThemedImages} 
          disabled={isGenerating}
          variant="outline"
          className="border-[#0C6E4E] text-[#0C6E4E] hover:bg-[#0C6E4E]/10"
        >
          Generate Themed Images
        </Button>
      </div>
      
      {generatedImageUrl && (
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-2">Generated Image:</h4>
          <div className="rounded-lg overflow-hidden bg-gray-100 shadow-inner">
            <img 
              src={generatedImageUrl} 
              alt="Generated" 
              className="w-full h-auto object-contain"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Path: {generatedImageUrl}
          </p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h4 className="text-lg font-medium text-amber-800 mb-2">Instructions</h4>
        <ol className="list-decimal list-inside text-amber-700 space-y-2">
          <li>Enter a detailed description of the image you want to generate</li>
          <li>Provide a filename (without extension)</li>
          <li>Click "Generate Image" to create a single custom image</li>
          <li>Click "Generate Themed Images" to create a set of pre-defined images for the website</li>
          <li>Generated images will be saved to the public directory and can be used throughout the website</li>
        </ol>
      </div>
    </div>
  );
};

export default ImageGenerator;