plugins {
	kotlin("jvm") version "2.1.21"
	kotlin("plugin.spring") version "2.1.20"
	kotlin("plugin.serialization") version "2.1.20"
	id("org.springframework.boot") version "3.4.5"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.turneringsportalen"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")

	implementation(platform("io.github.jan-tennert.supabase:bom:3.1.4"))
	implementation("io.github.jan-tennert.supabase:postgrest-kt")

	implementation("io.ktor:ktor-client-cio:3.1.3")

	runtimeOnly("org.postgresql:postgresql")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	// Allows for easier api testing
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.8")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
