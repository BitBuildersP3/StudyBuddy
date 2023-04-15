package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserVotesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserVotes.class);
        UserVotes userVotes1 = new UserVotes();
        userVotes1.setId(1L);
        UserVotes userVotes2 = new UserVotes();
        userVotes2.setId(userVotes1.getId());
        assertThat(userVotes1).isEqualTo(userVotes2);
        userVotes2.setId(2L);
        assertThat(userVotes1).isNotEqualTo(userVotes2);
        userVotes1.setId(null);
        assertThat(userVotes1).isNotEqualTo(userVotes2);
    }
}
