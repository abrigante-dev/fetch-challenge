# fetch-challenge

## Running the Receipt Processor API with Docker

The **Receipt Processor API** can be containerized and run using Docker. Below are the steps to build, run, and interact with the application in a Docker container.

---

### Prerequisites

- **Docker**

---

### Running the Docker Image

1. Clone the repo:

```bash
git clone https://github.com/abrigante-dev/fetch-challenge.git
```

2. Build the image:

```bash
cd fetch-challenge
docker build -t receipt-processor .
```

3. Run the container:

```bash
docker run -p 3000:3000 receipt-processor

```

## Testing Setup

```bash
git clone https://github.com/abrigante-dev/fetch-challenge.git
```

```bash
cd fetch-challenge
npm install
```

```bash
npx jest
```
