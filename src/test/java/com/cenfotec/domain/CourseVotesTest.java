package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CourseVotesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CourseVotes.class);
        CourseVotes courseVotes1 = new CourseVotes();
        courseVotes1.setId(1L);
        CourseVotes courseVotes2 = new CourseVotes();
        courseVotes2.setId(courseVotes1.getId());
        assertThat(courseVotes1).isEqualTo(courseVotes2);
        courseVotes2.setId(2L);
        assertThat(courseVotes1).isNotEqualTo(courseVotes2);
        courseVotes1.setId(null);
        assertThat(courseVotes1).isNotEqualTo(courseVotes2);
    }
}
