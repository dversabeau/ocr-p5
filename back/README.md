# Yoga App !


## Project Information
- Java Version: 1.8
- Spring Boot Version: 2.6.1
  
## Table of Contents
- [Dependencies](#dependencies)
- [Build and Run](#build-and-run)
- [Code Coverage](#code-coverage)

## Dependencies
- Spring Boot Starters:
  - `spring-boot-starter-data-jpa`
  - `spring-boot-starter-security`
  - `spring-boot-starter-validation`
  - `spring-boot-starter-web`
  - `spring-boot-starter-test`


- Database Connectivity:
  - `mysql-connector-java` for MySQL database connectivity
  - `h2` for an in-memory database during testing


- Security:
  - `jjwt`  (JSON Web Token) for authentication


- Mapping:
  -  `mapstruct`  and `mapstruct-processor` for object mapping


- Testing:
  - `junit` for unit testing


- Other:
  - `lombok` for reducing boilerplate code


## Build and Run

1. Clone the repository:
> git clone https://github.com/dversabeau/ocr-p5/tree/main/back

2. Navigate to the project directory:
> cd yoga-app

3. Build the project:
> ./mvnw clean install

4. Run the application:
> ./mvnw spring-boot:run

The application will be accessible at http://localhost:8080.

## Code Coverage
The project uses the JaCoCo Maven plugin for code coverage. The coverage threshold is set to 80%, and the report is generated during the test phase. To check the code coverage, execute:
> ./mvnw jacoco:check

