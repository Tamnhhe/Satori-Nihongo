package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Question.
 */
@Entity
@Table(name = "question")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Question implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "suggestion")
    private String suggestion;

    @Column(name = "answer_explanation")
    private String answerExplanation;

    @NotNull
    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;

    @NotNull
    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "question_text")
    private String questionText;

    @Column(name = "question_type")
    private String questionType;

    @Column(name = "options")
    private String options;

    @Column(name = "points")
    private Integer points;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "created_date")
    private Instant createdDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "question")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "quiz", "question" }, allowSetters = true)
    private Set<QuizQuestion> quizQuestions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Question id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return this.content;
    }

    public Question content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public Question imageUrl(String imageUrl) {
        this.setImageUrl(imageUrl);
        return this;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSuggestion() {
        return this.suggestion;
    }

    public Question suggestion(String suggestion) {
        this.setSuggestion(suggestion);
        return this;
    }

    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }

    public String getAnswerExplanation() {
        return this.answerExplanation;
    }

    public Question answerExplanation(String answerExplanation) {
        this.setAnswerExplanation(answerExplanation);
        return this;
    }

    public void setAnswerExplanation(String answerExplanation) {
        this.answerExplanation = answerExplanation;
    }

    public String getCorrectAnswer() {
        return this.correctAnswer;
    }

    public Question correctAnswer(String correctAnswer) {
        this.setCorrectAnswer(correctAnswer);
        return this;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getType() {
        return this.type;
    }

    public Question type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getQuestionText() {
        return this.questionText;
    }

    public Question questionText(String questionText) {
        this.setQuestionText(questionText);
        return this;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionType() {
        return this.questionType;
    }

    public Question questionType(String questionType) {
        this.setQuestionType(questionType);
        return this;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public String getOptions() {
        return this.options;
    }

    public Question options(String options) {
        this.setOptions(options);
        return this;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public Integer getPoints() {
        return this.points;
    }

    public Question points(Integer points) {
        this.setPoints(points);
        return this;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public String getDifficultyLevel() {
        return this.difficultyLevel;
    }

    public Question difficultyLevel(String difficultyLevel) {
        this.setDifficultyLevel(difficultyLevel);
        return this;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Question active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public Question createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Set<QuizQuestion> getQuizQuestions() {
        return this.quizQuestions;
    }

    public void setQuizQuestions(Set<QuizQuestion> quizQuestions) {
        if (this.quizQuestions != null) {
            this.quizQuestions.forEach(i -> i.setQuestion(null));
        }
        if (quizQuestions != null) {
            quizQuestions.forEach(i -> i.setQuestion(this));
        }
        this.quizQuestions = quizQuestions;
    }

    public Question quizQuestions(Set<QuizQuestion> quizQuestions) {
        this.setQuizQuestions(quizQuestions);
        return this;
    }

    public Question addQuizQuestions(QuizQuestion quizQuestion) {
        this.quizQuestions.add(quizQuestion);
        quizQuestion.setQuestion(this);
        return this;
    }

    public Question removeQuizQuestions(QuizQuestion quizQuestion) {
        this.quizQuestions.remove(quizQuestion);
        quizQuestion.setQuestion(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Question)) {
            return false;
        }
        return getId() != null && getId().equals(((Question) o).getId());
    }

    @Override
    public int hashCode() {
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Question{" +
                "id=" + getId() +
                ", content='" + getContent() + "'" +
                ", imageUrl='" + getImageUrl() + "'" +
                ", suggestion='" + getSuggestion() + "'" +
                ", answerExplanation='" + getAnswerExplanation() + "'" +
                ", correctAnswer='" + getCorrectAnswer() + "'" +
                ", type='" + getType() + "'" +
                "}";
    }
}
