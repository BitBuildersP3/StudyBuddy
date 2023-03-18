package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CoursesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Courses.class);
        Courses courses1 = new Courses();
        courses1.setId(1L);
        Courses courses2 = new Courses();
        courses2.setId(courses1.getId());
        assertThat(courses1).isEqualTo(courses2);
        courses2.setId(2L);
        assertThat(courses1).isNotEqualTo(courses2);
        courses1.setId(null);
        assertThat(courses1).isNotEqualTo(courses2);
    }
}
