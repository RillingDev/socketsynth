# Socketsynth

Realtime collaborative synthesizer using websockets.

## How Does it Work?

On the page, click one of the keys to create a sound. Other people which have the page open will hear that sound.
When other people press a key, you will hear it as well.

## Development

### Requirements

- Node.js >= 12
- JDK >= 11

### HTTPS

Create a keystore with a self-signed certificate (<https://www.baeldung.com/spring-boot-https-self-signed-certificate>) and adapt the application.properties parameters.