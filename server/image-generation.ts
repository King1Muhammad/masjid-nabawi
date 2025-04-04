import OpenAI from "openai";
import fs from "fs";
import path from "path";
import axios from "axios";
import { log } from "./vite";

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate an image using DALL-E
export async function generateImage(prompt: string, outputFilename: string): Promise<string> {
  try {
    log(`Generating image for prompt: ${prompt}`, "image-generation");

    // Call the OpenAI API to generate an image
    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI image model is "dall-e-3"
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    // Get the URL of the generated image
    const imageUrl = response.data[0].url;

    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    // Create the directory if it doesn't exist
    const outputDir = path.join(process.cwd(), "client", "public", "generated-images");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Download the image and save it locally
    const outputPath = path.join(outputDir, outputFilename);
    const response2 = await axios.get(imageUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(outputPath, response2.data);

    // Return the path to be used in the frontend
    return `/generated-images/${outputFilename}`;
  } catch (error: any) {
    log(`Error generating image: ${error.message}`, "image-generation");
    throw error;
  }
}

// Function to generate multiple images with different prompts
export async function generateMultipleImages(
  promptsWithFilenames: Array<{ prompt: string; filename: string }>
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  for (const { prompt, filename } of promptsWithFilenames) {
    try {
      const imagePath = await generateImage(prompt, filename);
      results[filename] = imagePath;
    } catch (error) {
      log(`Failed to generate image ${filename}`, "image-generation");
      console.error(error);
    }
  }

  return results;
}