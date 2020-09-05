import { registerAs } from '@nestjs/config';

export default registerAs('discourse', () => ({
  url: process.env.DISCOURSE_URL || 'http://localhost',
  user_list_query_id: parseInt(process.env.DISCOURSE_USER_LIST_QUERY_ID, 10),
  api_key: process.env.DISCOURSE_API_KEY,
  user: process.env.DISCOURSE_USER,
  custom_field_name: process.env.DISCOURSE_CUSTOM_FIELD_NAME,
  webhook_secret: process.env.DISCOURSE_WEBHOOK_SECRET,
}));
