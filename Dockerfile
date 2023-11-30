FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS dependencies
WORKDIR /app
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts
RUN pnpx prisma generate

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod 

FROM base as deploy
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 8000
CMD [ "pnpm", "start" ]