# Development environment setup

## Pre-Reqs
- Java 8 (java -version : 1.8)
- maven
- 

## application.properties file setup

Copy the `application.properties.example` as `application.properties` and fill it with your own credentials.

## Build the Project

Change your directory to the `spring-boot-app` and then build the project by running: `mvn clean install`.

## Running the server locally

If you haven't done so, change your directory to the `spring-boot-app`.

You can run the server with `mvn spring-boot:run`.

After running, the server should be listening on the port `8000`

`http://127.0.0.1:8000`
