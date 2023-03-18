package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExtraUserInfoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExtraUserInfo.class);
        ExtraUserInfo extraUserInfo1 = new ExtraUserInfo();
        extraUserInfo1.setId(1L);
        ExtraUserInfo extraUserInfo2 = new ExtraUserInfo();
        extraUserInfo2.setId(extraUserInfo1.getId());
        assertThat(extraUserInfo1).isEqualTo(extraUserInfo2);
        extraUserInfo2.setId(2L);
        assertThat(extraUserInfo1).isNotEqualTo(extraUserInfo2);
        extraUserInfo1.setId(null);
        assertThat(extraUserInfo1).isNotEqualTo(extraUserInfo2);
    }
}
