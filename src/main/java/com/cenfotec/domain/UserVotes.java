package com.cenfotec.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserVotes.
 */
@Entity
@Table(name = "user_votes")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserVotes implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "id_user")
    private String idUser;

    @Column(name = "json")
    private String json;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserVotes id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdUser() {
        return this.idUser;
    }

    public UserVotes idUser(String idUser) {
        this.setIdUser(idUser);
        return this;
    }

    public void setIdUser(String idUser) {
        this.idUser = idUser;
    }

    public String getJson() {
        return this.json;
    }

    public UserVotes json(String json) {
        this.setJson(json);
        return this;
    }

    public void setJson(String json) {
        this.json = json;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserVotes)) {
            return false;
        }
        return id != null && id.equals(((UserVotes) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserVotes{" +
            "id=" + getId() +
            ", idUser='" + getIdUser() + "'" +
            ", json='" + getJson() + "'" +
            "}";
    }
}
