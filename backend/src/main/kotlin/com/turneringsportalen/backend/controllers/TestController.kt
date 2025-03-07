package com.turneringsportalen.backend.controllers

import com.turneringsportalen.backend.entities.Match
import com.turneringsportalen.backend.services.TournamentService
import kotlinx.coroutines.runBlocking
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/test")
class TestController(private val service: TournamentService) {

    @GetMapping
    fun test() = runBlocking { service.setUpMatches(1) }
}