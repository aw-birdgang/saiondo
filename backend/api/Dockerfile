FROM node:20

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn prisma:generate
RUN yarn build

CMD ["node", "dist/src/main.js"]