package com.turneringsportalen.backend.utils

import com.turneringsportalen.backend.exceptions.InvalidDateException
import com.turneringsportalen.backend.exceptions.InvalidNumberException
import com.turneringsportalen.backend.exceptions.InvalidStringException
import kotlinx.datetime.Clock
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.fail
import kotlin.test.assertFailsWith
import kotlin.time.Duration.Companion.days
import kotlin.time.Duration.Companion.minutes

class ValidationUtilsTest {

    @Test
    fun stringValidationTest() {
        // Valid case 1: should not throw an exception.
        validateStrings("Slettebakken kunstgress", 3, 80, "Location")

        // Valid case 2: should not throw an exception.
        validateStrings("Vel Bevart Cup", 3, 60, "Tournament Name")

        // Invalid case 1: invalid characters (contains '@').
        val exception1 = assertFailsWith<InvalidStringException> {
            validateStrings("Cup: Vel Bevart Cup", 3, 65, "Tournament Name")
        }
        assertEquals("Tournament Name can only contain letters, numbers, and single spaces", exception1.message)

        // Invalid case 2: input is too short.
        val exception2 = assertFailsWith<InvalidStringException> {
            validateStrings("CH", 3, 65, "Tournament Name")
        }
        assertEquals("Tournament Name must be between 3 and 65 characters long", exception2.message)

        // Invalid case 3: input is too long.
        val exception3 = assertFailsWith<InvalidStringException> {
            validateStrings("The Number One Location", 3, 10, "(Fake) Location")
        }
        assertEquals("(Fake) Location must be between 3 and 10 characters long", exception3.message)

        // Invalid case 4: Double space
        val exception4 = assertFailsWith<InvalidStringException> {
            validateStrings("Vel  Bevart Cup", 3, 65, "Tournament Name")
        }
        assertEquals("Tournament Name can only contain letters, numbers, and single spaces", exception4.message)
    }

    @Test
    fun numberValidationTest() {
        // Valid case 1: Range is positive
        validateNumbers(5, 1, 10, "Minimum Matches")

        // Valid case 2: Range is negative
        validateNumbers(-5, -10, -1, "Minimum Matches")

        // Valid case 3: Range goes negative to positive
        validateNumbers(0, -5, 5, "Minimum Matches")

        // Valid case 4: Number is minimum
        validateNumbers(1, 1, 5, "Minimum Matches")

        // Valid case 5: Number is maximum
        validateNumbers(5, 1, 5, "Minimum Matches")

        // Invalid case 1: number to small
        val exception1 = assertFailsWith<InvalidNumberException> {
            validateNumbers(1, 2, 10, "Minimum Matches")
        }
        assertEquals("Minimum Matches must be between 2 and 10", exception1.message)

        // Invalid case 2: number to large
        val exception2 = assertFailsWith<InvalidNumberException> {
            validateNumbers(11, 1, 10, "Minimum Matches")
        }
        assertEquals("Minimum Matches must be between 1 and 10", exception2.message)

        // Invalid case 3: number is negative when supposed to be positive
        val exception3 = assertFailsWith<InvalidNumberException> {
            validateNumbers(-10, 0, Int.MAX_VALUE, "Minimum Matches")
        }
        assertEquals("Minimum Matches must be between 0 and ${Int.MAX_VALUE}", exception3.message)

        // Invalid case 4: number is positive when supposed to be negative
        val exception4 = assertFailsWith<InvalidNumberException> {
            validateNumbers(10, Int.MIN_VALUE, 0, "Minimum Matches")
        }
        assertEquals("Minimum Matches must be between ${Int.MIN_VALUE} and 0", exception4.message)
    }

    @Test
    fun dateValidationTest() {
        val now = Clock.System.now()

        // Valid case 1: in 5 minutes
        validateStartDateTime(now.plus(5.minutes))

        // Valid case 2: in nearly 2 years
        validateStartDateTime(now.plus(728.days))

        // Invalid case 1: yesterday
        val exception1 = assertFailsWith<InvalidDateException> {
            validateStartDateTime(now.minus(1.days))
        }
        assertEquals("Start date/time must be today or in the future", exception1.message)

        // Invalid case 2: 5 minutes ago
        val exception2 = assertFailsWith<InvalidDateException> {
            validateStartDateTime(now.minus(5.minutes))
        }
        assertEquals("Start date/time must be today or in the future", exception2.message)

        //Invalid case 3: over 2 years into the future
        val exception3 = assertFailsWith<InvalidDateException> {
            validateStartDateTime(now.plus(735.days))
        }
        assertEquals("Start date/time must be within the next 2 years", exception3.message)
    }
}