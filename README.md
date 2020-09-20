# Socketsynth

Realtime collaborative synthesizer using websockets.

## Architecture

### Backend

The backend is a rather simple Spring Boot project that takes websocket requests and broadcasts them to all browsers.

### Frontend

The frontend uses Stomp.js to handle websocket communication. When a user presses a key, a websocket event is published containing data about which key was pressed. If the websocket subscription receives an event, the browser plays the corresponding note.

## Development

### Requirements

-   Node.js >= 12
-   JDK >= 11

### HTTPS

Create a keystore with a self-signed certificate (<https://www.baeldung.com/spring-boot-https-self-signed-certificate>) and adapt the application.properties parameters.
