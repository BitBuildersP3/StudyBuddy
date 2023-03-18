package com.cenfotec.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ExtraUserInfo.
 */
@Entity
@Table(name = "extra_user_info")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ExtraUserInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "phone")
    private String phone;

    @Column(name = "degree")
    private String degree;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "birth_day")
    private LocalDate birthDay;

    @Column(name = "score")
    private Double score;

    @Column(name = "user_votes")
    private Double userVotes;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ExtraUserInfo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhone() {
        return this.phone;
    }

    public ExtraUserInfo phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDegree() {
        return this.degree;
    }

    public ExtraUserInfo degree(String degree) {
        this.setDegree(degree);
        return this;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getProfilePicture() {
        return this.profilePicture;
    }

    public ExtraUserInfo profilePicture(String profilePicture) {
        this.setProfilePicture(profilePicture);
        return this;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public LocalDate getBirthDay() {
        return this.birthDay;
    }

    public ExtraUserInfo birthDay(LocalDate birthDay) {
        this.setBirthDay(birthDay);
        return this;
    }

    public void setBirthDay(LocalDate birthDay) {
        this.birthDay = birthDay;
    }

    public Double getScore() {
        return this.score;
    }

    public ExtraUserInfo score(Double score) {
        this.setScore(score);
        return this;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Double getUserVotes() {
        return this.userVotes;
    }

    public ExtraUserInfo userVotes(Double userVotes) {
        this.setUserVotes(userVotes);
        return this;
    }

    public void setUserVotes(Double userVotes) {
        this.userVotes = userVotes;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ExtraUserInfo user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExtraUserInfo)) {
            return false;
        }
        return id != null && id.equals(((ExtraUserInfo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExtraUserInfo{" +
            "id=" + getId() +
            ", phone='" + getPhone() + "'" +
            ", degree='" + getDegree() + "'" +
            ", profilePicture='" + getProfilePicture() + "'" +
            ", birthDay='" + getBirthDay() + "'" +
            ", score=" + getScore() +
            ", userVotes=" + getUserVotes() +
            "}";
    }
}
