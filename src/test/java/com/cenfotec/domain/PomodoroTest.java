package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PomodoroTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pomodoro.class);
        Pomodoro pomodoro1 = new Pomodoro();
        pomodoro1.setId(1L);
        Pomodoro pomodoro2 = new Pomodoro();
        pomodoro2.setId(pomodoro1.getId());
        assertThat(pomodoro1).isEqualTo(pomodoro2);
        pomodoro2.setId(2L);
        assertThat(pomodoro1).isNotEqualTo(pomodoro2);
        pomodoro1.setId(null);
        assertThat(pomodoro1).isNotEqualTo(pomodoro2);
    }
}
