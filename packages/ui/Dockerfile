FROM node:22-alpine

ENV NODE_ENV=development

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
RUN echo "shamefully-hoist=true" > .npmrc
COPY packages/ui/package.json packages/ui/
COPY packages/shared-types/package.json packages/shared-types/

RUN pnpm install --frozen-lockfile

COPY packages/ui packages/ui
COPY packages/shared-types packages/shared-types

WORKDIR /app/packages/ui
EXPOSE 6006
CMD ["sh", "-c", "node ../../node_modules/storybook/bin/index.cjs dev -p 6006 --host 0.0.0.0 --no-open"]
