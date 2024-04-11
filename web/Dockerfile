FROM oven/bun as builder

WORKDIR /app

COPY . .

RUN bun i
RUN bun run build

FROM oven/bun
COPY --from=builder /app/build .

EXPOSE 3001

ENTRYPOINT [ "bun", "run", "start" ]