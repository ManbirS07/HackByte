import { 
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold 
} from "@google/generative-ai";
import fs from 'node:fs';
import mime from 'mime-types';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [
  ],
  responseMimeType: "text/plain",
};

export const response = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        // ...existing code...
      ],
    },
    {
      role: "model",
      parts: [
        // ...existing code...
      ],
    },
  ],
});

// The commented out code also needs to be converted:
//
// export const processResult = async (result) => {
//   const candidates = result.response.candidates;
//   for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
//     for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
//       const part = candidates[candidate_index].content.parts[part_index];
//       if(part.inlineData) {
//         try {
//           const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
//           fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
//           console.log(`Output written to: ${filename}`);
//         } catch (err) {
//           console.error(err);
//         }
//       }
//     }
//   }
//   console.log(result.response.text());
// };