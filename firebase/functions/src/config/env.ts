import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    firebase: {
        databaseId: process.env.FIREBASE_DATABASE_ID || 'mcp-demo-database',
        region: process.env.FIREBASE_REGION || 'asia-northeast3',
    },
    claude: {
        apiKey: process.env.CLAUDE_API_KEY,
        endpoint: process.env.CLAUDE_API_ENDPOINT || 'https://api.anthropic.com/v1/messages',
    },
};
