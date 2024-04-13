FROM oven/bun as builder

ARG PUBLIC_DATABASE
ENV PUBLIC_DATABASE=${PUBLIC_DATABASE}
ENV ORIGIN="https://zerzinator.cc-web.cloud"

WORKDIR /app

COPY . .

RUN bun i
RUN bun run build

FROM oven/bun
COPY --from=builder /app/build .

EXPOSE 3001

ENTRYPOINT [ "ORIGIN=https://zerzinator.cc-web.cloud", "bun", "index.js" ]