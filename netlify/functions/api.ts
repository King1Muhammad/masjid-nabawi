import type { Handler } from '@netlify/functions';
import express from 'express';
import cors from 'cors';
import { routes } from '../../server/routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Create serverless handler
const handler: Handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Handle the request using Express
    const response = await new Promise((resolve) => {
      app(event, context, (err, result) => {
        if (err) {
          resolve({
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error' })
          });
        } else {
          resolve(result);
        }
      });
    });

    return {
      ...response,
      headers: {
        ...response.headers,
        ...headers
      }
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

export { handler }; 