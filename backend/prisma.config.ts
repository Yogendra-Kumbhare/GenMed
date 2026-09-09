import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';

const url = process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? '';

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
