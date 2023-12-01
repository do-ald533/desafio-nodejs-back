FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS development
WORKDIR /app
COPY .npmrc pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY . .

RUN pnpm install

RUN pnpm prisma generate

FROM base AS build
WORKDIR /app
COPY pnpm-lock.yaml .npmrc ./
COPY --from=development /app/node_modules ./node_modules
COPY . .
RUN pnpm build

RUN pnpm install --prod --ignore-scripts

RUN npx prisma generate

FROM base as deploy
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build app/package.json .
EXPOSE 8000
CMD [ "pnpm", "start:prod" ]