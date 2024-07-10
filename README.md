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

To start the server on your local machine, run. This will run on port 3000:

```sh
npm start
```

## Use Dockerfile to run the application

To create a docker image
```sh
docker build . -t receipt-processor:latest
```

To create a container and run the container in detached mode on port 3000

```sh
docker run --name receipts -d -p 3000:3000 receipt-processor
```
