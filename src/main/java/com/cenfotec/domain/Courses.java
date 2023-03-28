package com.cenfotec.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Courses.
 */
@Entity
@Table(name = "courses")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Courses implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "preview_img")
    private String previewImg;

    @Column(name = "status")
    private String status;

    @Column(name = "score")
    private Double score;

    @Column(name = "excerpt")
    private String excerpt;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "user_votes")
    private Double userVotes;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "user_name")
    private String userName;

    @ManyToMany
    @JoinTable(
        name = "rel_courses__user",
        joinColumns = @JoinColumn(name = "courses_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<User> users = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "courses" }, allowSetters = true)
    private Category category;

    @OneToMany(mappedBy = "courses")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "files", "courses" }, allowSetters = true)
    private Set<Section> sections = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Courses id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Courses name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Courses description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPreviewImg() {
        return this.previewImg;
    }

    public Courses previewImg(String previewImg) {
        this.setPreviewImg(previewImg);
        return this;
    }

    public void setPreviewImg(String previewImg) {
        this.previewImg = previewImg;
    }

    public String getStatus() {
        return this.status;
    }

    public Courses status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getScore() {
        return this.score;
    }

    public Courses score(Double score) {
        this.setScore(score);
        return this;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getExcerpt() {
        return this.excerpt;
    }

    public Courses excerpt(String excerpt) {
        this.setExcerpt(excerpt);
        return this;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public Courses userId(Integer userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Double getUserVotes() {
        return this.userVotes;
    }

    public Courses userVotes(Double userVotes) {
        this.setUserVotes(userVotes);
        return this;
    }

    public void setUserVotes(Double userVotes) {
        this.userVotes = userVotes;
    }

    public String getOwnerName() {
        return this.ownerName;
    }

    public Courses ownerName(String ownerName) {
        this.setOwnerName(ownerName);
        return this;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getUserName() {
        return this.userName;
    }

    public Courses userName(String userName) {
        this.setUserName(userName);
        return this;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Set<User> getUsers() {
        return this.users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Courses users(Set<User> users) {
        this.setUsers(users);
        return this;
    }

    public Courses addUser(User user) {
        this.users.add(user);
        return this;
    }

    public Courses removeUser(User user) {
        this.users.remove(user);
        return this;
    }

    public Category getCategory() {
        return this.category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Courses category(Category category) {
        this.setCategory(category);
        return this;
    }

    public Set<Section> getSections() {
        return this.sections;
    }

    public void setSections(Set<Section> sections) {
        if (this.sections != null) {
            this.sections.forEach(i -> i.setCourses(null));
        }
        if (sections != null) {
            sections.forEach(i -> i.setCourses(this));
        }
        this.sections = sections;
    }

    public Courses sections(Set<Section> sections) {
        this.setSections(sections);
        return this;
    }

    public Courses addSection(Section section) {
        this.sections.add(section);
        section.setCourses(this);
        return this;
    }

    public Courses removeSection(Section section) {
        this.sections.remove(section);
        section.setCourses(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Courses)) {
            return false;
        }
        return id != null && id.equals(((Courses) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Courses{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", previewImg='" + getPreviewImg() + "'" +
            ", status='" + getStatus() + "'" +
            ", score=" + getScore() +
            ", excerpt='" + getExcerpt() + "'" +
            ", userId=" + getUserId() +
            ", userVotes=" + getUserVotes() +
            ", ownerName='" + getOwnerName() + "'" +
            ", userName='" + getUserName() + "'" +
            "}";
    }
}
