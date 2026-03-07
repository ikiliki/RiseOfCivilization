FROM node:22-alpine

ENV NODE_ENV=development

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json eslint.config.js .prettierrc ./
COPY pnpm-lock.yaml ./
RUN echo "shamefully-hoist=true" > .npmrc
COPY apps/server/package.json apps/server/
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/world-engine/package.json packages/world-engine/
COPY packages/ui/package.json packages/ui/

RUN pnpm install --frozen-lockfile

COPY apps/server apps/server
COPY packages/shared-types packages/shared-types
COPY packages/world-engine packages/world-engine

WORKDIR /app
EXPOSE 4000
CMD ["pnpm", "--filter", "@roc/server", "dev"]
