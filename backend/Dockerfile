# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Gradle wrapper and build files
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Copy the source code
COPY src src

# Make the gradlew script executable
RUN chmod +x ./gradlew

# Build the application
RUN ./gradlew clean build -x test

# Expose the port the app runs on
EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]
