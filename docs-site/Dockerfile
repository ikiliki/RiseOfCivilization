FROM node:22-alpine

ENV NODE_ENV=development

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json eslint.config.js .prettierrc ./
COPY pnpm-lock.yaml ./
RUN echo "shamefully-hoist=true" > .npmrc
COPY docs-site/package.json docs-site/

RUN pnpm install --frozen-lockfile

COPY docs-site docs-site
COPY docs docs
COPY PLAN.md ./

WORKDIR /app
EXPOSE 5555
CMD ["sh", "-c", "pnpm docs:sync && node node_modules/vite/bin/vite.js docs-site --config docs-site/vite.config.ts --host 0.0.0.0 --port 5555"]
