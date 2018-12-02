# FROM golang:1.11.2-alpine3.8
FROM golang:1.11.2

# RUN apk update && apk upgrade \
#     && apk add curl git gcc

WORKDIR /go/src/api
COPY ./src .
ENV GO111MODULE=on

RUN go get github.com/pilu/fresh
CMD ["fresh"]
