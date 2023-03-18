package com.cenfotec.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Section.
 */
@Entity
@Table(name = "section")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Section implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "excerpt")
    private String excerpt;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @Column(name = "time")
    private Integer time;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "section")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "section" }, allowSetters = true)
    private Set<Files> files = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "users", "category", "sections" }, allowSetters = true)
    private Courses courses;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Section id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Section name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Section description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getExcerpt() {
        return this.excerpt;
    }

    public Section excerpt(String excerpt) {
        this.setExcerpt(excerpt);
        return this;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public LocalDate getCreationDate() {
        return this.creationDate;
    }

    public Section creationDate(LocalDate creationDate) {
        this.setCreationDate(creationDate);
        return this;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public Integer getTime() {
        return this.time;
    }

    public Section time(Integer time) {
        this.setTime(time);
        return this;
    }

    public void setTime(Integer time) {
        this.time = time;
    }

    public String getStatus() {
        return this.status;
    }

    public Section status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<Files> getFiles() {
        return this.files;
    }

    public void setFiles(Set<Files> files) {
        if (this.files != null) {
            this.files.forEach(i -> i.setSection(null));
        }
        if (files != null) {
            files.forEach(i -> i.setSection(this));
        }
        this.files = files;
    }

    public Section files(Set<Files> files) {
        this.setFiles(files);
        return this;
    }

    public Section addFiles(Files files) {
        this.files.add(files);
        files.setSection(this);
        return this;
    }

    public Section removeFiles(Files files) {
        this.files.remove(files);
        files.setSection(null);
        return this;
    }

    public Courses getCourses() {
        return this.courses;
    }

    public void setCourses(Courses courses) {
        this.courses = courses;
    }

    public Section courses(Courses courses) {
        this.setCourses(courses);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Section)) {
            return false;
        }
        return id != null && id.equals(((Section) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Section{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", excerpt='" + getExcerpt() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            ", time=" + getTime() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
