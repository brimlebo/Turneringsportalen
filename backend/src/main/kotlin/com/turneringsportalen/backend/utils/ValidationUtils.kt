package com.turneringsportalen.backend.utils

import com.turneringsportalen.backend.dto.CreateTournamentDTO
import com.turneringsportalen.backend.exceptions.InvalidDateException
import com.turneringsportalen.backend.exceptions.InvalidNumberException
import com.turneringsportalen.backend.exceptions.InvalidStringException
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import java.time.temporal.ChronoUnit
import kotlin.time.Duration.Companion.days
import kotlin.time.Duration.Companion.minutes

// Regex pattern for name and location validation:
// Matches letters (a-z, A-Z), numbers (0-9), and single spaces (not at start or end, no consecutive spaces)
val textInputRegex = Regex("^[A-Za-z0-9]+(?:\\s[A-Za-z0-9]+)*$")

/**
 * Validates that the string matches the allowed characters and is within the specified length.
 *
 * @param input The string to validate.
 * @param minLength The minimum allowed length.
 * @param maxLength The maximum allowed length.
 * @param fieldName The name of the field (used in error messages).
 * @throws InvalidStringException If the string is invalid, includes an error message
 */
fun validateStrings(input: String, minLength: Int, maxLength: Int, fieldName: String) {
    if (!textInputRegex.matches(input)) {
        throw InvalidStringException("$fieldName can only contain letters, numbers, and single spaces")
    } else if (input.length < minLength || input.length > maxLength) {
        throw InvalidStringException("$fieldName must be between $minLength and $maxLength characters long")
    }
}

/**
 * Validates that a number is within the given range.
 *
 * @param input The number to validate.
 * @param min The minimum allowed value.
 * @param max The maximum allowed value.
 * @param fieldName The name of the field (used in error messages).
 * @throws InvalidNumberException If the number is higher than max allowed or smaller than min allowed
 */
fun validateNumbers(input: Int, min: Int, max: Int, fieldName: String) {
    if (input < min || input > max) {
        throw InvalidNumberException("$fieldName must be between $min and $max")
    }
}

/**
 * Validates the given start date/time as an Instant.
 *
 * The function checks that:
 * - The datetime is not in the past (must be now or later).
 * - The datetime is within the next 2 years.
 *
 * @param dateTime The Instant representing the start date/time.
 * @throws InvalidDateException If the datetime is invalid.
 */
fun validateStartDateTime(dateTime: Instant) {
    val now = Clock.System.now()
    val twoYearsFromNow = now.plus(730.days) // Approximation: 730 days ≈ 2 years

    if (dateTime < now) {
        throw InvalidDateException("Start date/time must be today or in the future")
    }
    if (dateTime > twoYearsFromNow) {
        throw InvalidDateException("Start date/time must be within the next 2 years")
    }
}

/**
 * The full validation of a tournament that is about to be created
 * @param tournament The CreateTournamentDTO that is about to be created
 * @throws InvalidDateException If the startDate is invalid.
 * @throws InvalidNumberException If minimumMatches, matchInterval or the size of fieldNames is outside allowed range
 * @throws InvalidStringException If tournamentName, location or a fieldName is invalid, too short or too long
 */
fun validateTournamentToBeCreated(tournament: CreateTournamentDTO) {
    validateStrings(tournament.name, 3, 60, "Tournament Name")
    validateStrings(tournament.location, 2, 80, "Location")
    validateStartDateTime(tournament.startDate)
    validateNumbers(tournament.minimumMatches, 1, 10, "Minimum Matches")
    validateNumbers(tournament.matchInterval, 0, 300, "Match Interval")
    validateNumbers(tournament.fieldNames.size, 1, 200, "Number of Fields")
    for(field in tournament.fieldNames) {
        validateStrings(field, 2, 60, "The field name $field")
    }
}
