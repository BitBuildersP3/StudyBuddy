package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ForoEntityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ForoEntity.class);
        ForoEntity foroEntity1 = new ForoEntity();
        foroEntity1.setId("id1");
        ForoEntity foroEntity2 = new ForoEntity();
        foroEntity2.setId(foroEntity1.getId());
        assertThat(foroEntity1).isEqualTo(foroEntity2);
        foroEntity2.setId("id2");
        assertThat(foroEntity1).isNotEqualTo(foroEntity2);
        foroEntity1.setId(null);
        assertThat(foroEntity1).isNotEqualTo(foroEntity2);
    }
}
