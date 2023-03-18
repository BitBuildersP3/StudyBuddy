package com.cenfotec.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pomodoro.
 */
@Entity
@Table(name = "pomodoro")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Pomodoro implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "begin_time")
    private LocalDate beginTime;

    @Column(name = "end_time")
    private LocalDate endTime;

    @Column(name = "total_time")
    private Double totalTime;

    @Column(name = "status")
    private String status;

    @Column(name = "task")
    private String task;

    @Column(name = "begin_break")
    private LocalDate beginBreak;

    @Column(name = "end_break")
    private LocalDate endBreak;

    @Column(name = "total_break")
    private Double totalBreak;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pomodoro id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getBeginTime() {
        return this.beginTime;
    }

    public Pomodoro beginTime(LocalDate beginTime) {
        this.setBeginTime(beginTime);
        return this;
    }

    public void setBeginTime(LocalDate beginTime) {
        this.beginTime = beginTime;
    }

    public LocalDate getEndTime() {
        return this.endTime;
    }

    public Pomodoro endTime(LocalDate endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(LocalDate endTime) {
        this.endTime = endTime;
    }

    public Double getTotalTime() {
        return this.totalTime;
    }

    public Pomodoro totalTime(Double totalTime) {
        this.setTotalTime(totalTime);
        return this;
    }

    public void setTotalTime(Double totalTime) {
        this.totalTime = totalTime;
    }

    public String getStatus() {
        return this.status;
    }

    public Pomodoro status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTask() {
        return this.task;
    }

    public Pomodoro task(String task) {
        this.setTask(task);
        return this;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public LocalDate getBeginBreak() {
        return this.beginBreak;
    }

    public Pomodoro beginBreak(LocalDate beginBreak) {
        this.setBeginBreak(beginBreak);
        return this;
    }

    public void setBeginBreak(LocalDate beginBreak) {
        this.beginBreak = beginBreak;
    }

    public LocalDate getEndBreak() {
        return this.endBreak;
    }

    public Pomodoro endBreak(LocalDate endBreak) {
        this.setEndBreak(endBreak);
        return this;
    }

    public void setEndBreak(LocalDate endBreak) {
        this.endBreak = endBreak;
    }

    public Double getTotalBreak() {
        return this.totalBreak;
    }

    public Pomodoro totalBreak(Double totalBreak) {
        this.setTotalBreak(totalBreak);
        return this;
    }

    public void setTotalBreak(Double totalBreak) {
        this.totalBreak = totalBreak;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Pomodoro user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pomodoro)) {
            return false;
        }
        return id != null && id.equals(((Pomodoro) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pomodoro{" +
            "id=" + getId() +
            ", beginTime='" + getBeginTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", totalTime=" + getTotalTime() +
            ", status='" + getStatus() + "'" +
            ", task='" + getTask() + "'" +
            ", beginBreak='" + getBeginBreak() + "'" +
            ", endBreak='" + getEndBreak() + "'" +
            ", totalBreak=" + getTotalBreak() +
            "}";
    }
}
