import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url,
  },
  migrate: {
    async adapter() {
      return new PrismaPg(url);
    },
  },
});
