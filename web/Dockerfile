FROM oven/bun as builder

ARG PUBLIC_DATABASE
ENV PUBLIC_DATABASE=${PUBLIC_DATABASE}

WORKDIR /app

COPY . .
ENV ORIGIN=https://zerzinator.cc-web.cloud

RUN bun i
RUN bun run build

FROM oven/bun
COPY --from=builder /app/build .

ENV ORIGIN=https://zerzinator.cc-web.cloud

EXPOSE 3001

CMD [ "bun", "index.js" ]