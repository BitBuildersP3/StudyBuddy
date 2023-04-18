package com.cenfotec.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CourseVotes.
 */
@Entity
@Table(name = "course_votes")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CourseVotes implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "id_course")
    private Long idCourse;

    @Column(name = "json")
    private String json;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CourseVotes id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdCourse() {
        return this.idCourse;
    }

    public CourseVotes idCourse(Long idCourse) {
        this.setIdCourse(idCourse);
        return this;
    }

    public void setIdCourse(Long idCourse) {
        this.idCourse = idCourse;
    }

    public String getJson() {
        return this.json;
    }

    public CourseVotes json(String json) {
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
        if (!(o instanceof CourseVotes)) {
            return false;
        }
        return id != null && id.equals(((CourseVotes) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CourseVotes{" +
            "id=" + getId() +
            ", idCourse=" + getIdCourse() +
            ", json='" + getJson() + "'" +
            "}";
    }
}
