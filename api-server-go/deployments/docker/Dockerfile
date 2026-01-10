# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /build

# Copy dependency files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo \
    -ldflags '-extldflags "-static" -s -w' \
    -o api-server ./cmd/api

# Runtime stage
FROM gcr.io/distroless/static-debian12:nonroot

LABEL maintainer="Formalogix <tech@formalogix.com>"
LABEL description="Formalogix Contact Form API Server"

WORKDIR /app

# Copy binary from builder
COPY --from=builder /build/api-server .

# Use non-root user (distroless nonroot UID)
USER nonroot:nonroot

EXPOSE 3000

ENTRYPOINT ["/app/api-server"]
