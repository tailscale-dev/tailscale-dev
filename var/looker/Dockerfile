FROM golang:1.20-alpine AS build

WORKDIR /ts/looker

COPY go.mod go.sum .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o looker .

FROM alpine:3.17

# looker needs Git installed at runtime
RUN apk --no-cache -U add git

WORKDIR /ts
COPY --from=build /ts/looker/looker .
CMD ["/ts/looker"]