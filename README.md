This repo contains an ExpressJS server to get information about Youtube video and download and strip audio by video URL or video ID.

## Tech Stack
- **[ExpressJS](https://expressjs.com)**
- **[Docker](https://www.docker.com)**

### Requirements
- **[Docker](https://www.docker.com)**

### Installation
Clone the GitHub repository
```bash
git clone git@github.com:snaksa/youtube-mp3-downloader.git
cd youtube-mp3-downloader
```

Build docker image or use the public one from **[DockerHub](https://hub.docker.com/u/snaksa)**
```bash
docker build -t snaksa/youtube-mp3-downloader .
```

Docker Compose configuration to run the project
```yaml
version: "3"

services:
  app:
    image: snaksa/youtube-mp3-downloader
    build:
      context: .
    container_name: youtube-mp3-downloader
    env_file:
      - .env
    ports:
      - "9090:8080"
``` 