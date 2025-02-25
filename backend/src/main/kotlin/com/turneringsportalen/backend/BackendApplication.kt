package com.turneringsportalen.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.awt.Desktop
import java.net.URI

@SpringBootApplication
class BackendApplication

fun main(args: Array<String>) {
	runApplication<BackendApplication>(*args)

	// Open Swagger UI in default browser
	val swaggerUrl = "http://localhost:8080/swagger-ui.html"
	if (Desktop.isDesktopSupported()) {
		Desktop.getDesktop().browse(URI(swaggerUrl))
	}
}
