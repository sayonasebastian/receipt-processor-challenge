# Receipt-processor-challenge

A simple receipt processor

## Prerequisites

- Node.js (v12.x or later)
- npm (v6.x or later)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/sayonasebastian/receipt-processor-challenge.git
    cd receipt-processor-challenge
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

## Running the Server

To start the server, run:

```sh
npm start
```

## Use Dockerfile to run the application
- `docker build . -t receipt-processor:latest` this will create the docker image
- `docker run --name receipts -d -p 3000:3000 receipt-processor` this will create the container and run the container in detached mode on port 3000.  