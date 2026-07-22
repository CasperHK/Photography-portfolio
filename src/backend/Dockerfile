FROM golang:1.25-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o server .

EXPOSE 8080

CMD ["/app/server"]
