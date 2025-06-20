<template>
  <div :class="isDarkMode ? 'dark-mode' : 'light-mode'" class="dashboard-container">
    <LanguageSwitcher />
    <div class="dashboard-content">
      <!-- Welcome Section -->
      <div class="header-content">
        <!-- Title and Subtitle -->
        <div class="title-section">
          <h1 class="dashboard-title">
            <span class="title-regular">{{ $t('dashboard.welcome') }}</span>
            <span class="title-fancy">{{ studentName }}</span>
          </h1>
          <p class="dashboard-subtitle">{{ $t('dashboard.learning_journey') }}</p>
        </div>

        <!-- Right: Logout Button -->
        <button @click="logoutUser" class="primary-btn">{{ $t('dashboard.logout') }}</button>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>{{ $t('dashboard.stats.current_cgpa') }}</h3>
          <p class="stat-value">3.85</p>
          <p class="stat-trend positive">{{ $t('dashboard.stats.from_last_semester') }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('dashboard.stats.upcoming_deadlines') }}</h3>
          <p class="stat-value">{{ upcomingDeadlines.length }}</p>
          <p class="stat-trend" v-if="upcomingDeadlines.length > 0">{{ $t('dashboard.stats.next_in_days', { days: upcomingDeadlines[0].daysLeft }) }}</p>
          <p class="stat-trend" v-else>{{ $t('dashboard.stats.no_upcoming_deadlines') }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('dashboard.stats.course_progress') }}</h3>
          <p class="stat-value">78%</p>
          <p class="stat-trend positive">{{ $t('dashboard.stats.on_track') }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('dashboard.stats.study_streak') }}</h3>
          <p class="stat-value">5 days</p>
          <p class="stat-trend">{{ $t('dashboard.stats.keep_it_up') }}</p>
        </div>
      </div>

      <!-- AI Assistants Section (Split into two) -->
      <div class="ai-assistants-grid">
        <!-- Handbook Assistant (Left) -->
        <div class="dashboard-card handbook-assistant-card">
          <div class="card-header">
            <h2>{{ $t('dashboard.ai_assistants.handbook_assistant') }}</h2>
            <button class="action-btn" @click="navigateToChatbot">{{ $t('dashboard.ai_assistants.continue_to_chat') }}</button>
          </div>
          <div class="chatbot-features">
            <div v-for="feature in chatbotFeatures" :key="feature.id" class="feature-item">
              <div class="feature-icon">{{ feature.icon }}</div>
              <div class="feature-info">
                <h4>{{ $t(feature.titleKey) }}</h4>
                <p>{{ $t(feature.descriptionKey) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Insights (Right) -->
        <div class="dashboard-card ai-insights-card">
          <div class="card-header">
            <h2>{{ $t('dashboard.ai_assistants.ai_insights') }}</h2>
            <button class="action-btn" @click="navigateToInsights">{{ $t('dashboard.ai_assistants.view_insights') }}</button>
          </div>
          <div class="chatbot-features">
            <div v-for="feature in insightsFeatures" :key="feature.id" class="feature-item">
              <div class="feature-icon">{{ feature.icon }}</div>
              <div class="feature-info">
                <h4>{{ $t(feature.titleKey) }}</h4>
                <p>{{ $t(feature.descriptionKey) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Learning AI Section -->
      <div class="dashboard-card video-chatbot-card">
        <div class="card-header">
          <h2>{{ $t('dashboard.ai_assistants.video_learning_ai') }}</h2>
          <button class="action-btn" @click="navigateToVideoChatbot">{{ $t('dashboard.ai_assistants.watch_learn') }}</button>
        </div>
        <div class="chatbot-features">
          <div v-for="feature in videoChatbotFeatures" :key="feature.id" class="feature-item">
            <div class="feature-icon">{{ feature.icon }}</div>
            <div class="feature-info">
              <h4>{{ $t(feature.titleKey) }}</h4>
              <p>{{ $t(feature.descriptionKey) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Upcoming Deadlines -->
        <div class="dashboard-card deadlines-card">
          <div class="card-header">
            <h2>{{ $t('dashboard.sections.upcoming_deadlines') }}</h2>
            <button class="view-all-btn" onclick="window.location.href='/deadline'">{{ $t('dashboard.sections.view_all') }}</button>
          </div>
          <div class="deadline-list" v-if="isLoadingDeadlines">
            <div class="loading-indicator">{{ $t('dashboard.sections.loading_deadlines') }}</div>
          </div>
          <div class="deadline-list" v-else-if="deadlineError">
            <div class="error-message">{{ deadlineError }}</div>
          </div>
          <div class="deadline-list" v-else-if="upcomingDeadlines.length === 0">
            <div class="no-deadlines">{{ $t('dashboard.sections.no_deadlines_found') }}</div>
          </div>
          <div class="deadline-list" v-else>
            <div v-for="deadline in upcomingDeadlines" :key="deadline.id" class="deadline-item">
              <div class="deadline-info">
                <h4>{{ deadline.title }}</h4>
                <p>{{ deadline.course }}</p>
              </div>
              <div class="deadline-date" :class="{ 'urgent': deadline.daysLeft <= 2 }">
                {{ $t('dashboard.sections.days_left', { days: deadline.daysLeft }) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Course Progress -->
        <div class="dashboard-card progress-card">
          <div class="card-header">
            <h2>{{ $t('dashboard.sections.course_progress') }}</h2>
            <button class="view-all-btn" onclick="window.location.href='/studentresources'">{{ $t('dashboard.sections.details') }}</button>
          </div>
          <div class="progress-list">
            <div v-for="course in courses" :key="course.id" class="progress-item">
              <div class="progress-info">
                <h4>{{ course.name }}</h4>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: course.progress + '%' }"></div>
                </div>
              </div>
              <span class="progress-percentage">{{ course.progress }}%</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="dashboard-card activity-card">
          <div class="card-header">
            <h2>{{ $t('dashboard.sections.recent_activity') }}</h2>
            <button class="view-all-btn">{{ $t('dashboard.sections.view_all') }}</button>
          </div>
          <div class="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                {{ activity.icon }}
              </div>
              <div class="activity-info">
                <h4>{{ $t(activity.titleKey, activity.params) }}</h4>
                <p>{{ activity.timestamp }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Faculty Feedback -->
        <div class="dashboard-card feedback-card">
          <div class="card-header">
            <h2>{{ $t('dashboard.sections.faculty_feedback') }}</h2>
            <button class="view-all-btn" @click="navigateToFeedback">{{ $t('dashboard.sections.give_feedback') }}</button>
          </div>
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">🎯</div>
              <div class="feature-info">
                <h4>{{ $t('dashboard.feedback.direct_feedback') }}</h4>
                <p>{{ $t('dashboard.feedback.direct_feedback_desc') }}</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📈</div>
              <div class="feature-info">
                <h4>{{ $t('dashboard.feedback.course_improvement') }}</h4>
                <p>{{ $t('dashboard.feedback.course_improvement_desc') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Study Timer Card -->
        <div class="dashboard-card timer-card">
          <div class="card-header">
            <h2>{{ $t('dashboard.sections.study_timer') }}</h2>
            <button class="view-all-btn" @click="toggleTimer">{{ isTimerRunning ? $t('dashboard.timer.stop') : $t('dashboard.timer.start') }}</button>
          </div>
          <div class="timer-content">
            <div class="timer-display">{{ formatTime(timerSeconds) }}</div>
            <div class="timer-stats">
              <div class="stat-item">
                <span class="stat-label">{{ $t('dashboard.timer.todays_focus_time') }}</span>
                <span class="stat-value">2h 45m</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ $t('dashboard.timer.weekly_goal') }}</span>
                <span class="stat-value">75%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Links Card -->
        <div class="dashboard-card quick-links-card">
          <div class="card-header">
            <h2>{{ $t('dashboard.sections.quick_links') }}</h2>
          </div>
          <div class="links-grid">
            <a v-for="link in quickLinks"
               :key="link.id"
               :href="link.url"
               class="quick-link-item">
              <div class="link-icon">{{ link.icon }}</div>
              <span class="link-label">{{ $t(link.labelKey) }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <footer class="dashboard-footer">
      Made with ❤️ by Ayan
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';

export default {
  name: 'StudentDashboard',
  components: {
    LanguageSwitcher
  },
  data() {
    return {
      isDarkMode: true,
      studentName: 'Student',
      selectedFaculty: '',
      feedbackText: '',
      rating: 0,
      isLoadingDeadlines: true,
      deadlineError: null,
      upcomingDeadlines: [],
      chatbotFeatures: [
        {
          id: 1,
          icon: '🤖',
          titleKey: 'dashboard.ai_assistants.features.rag_powered.title',
          descriptionKey: 'dashboard.ai_assistants.features.rag_powered.description'
        },
        {
          id: 2,
          icon: '📚',
          titleKey: 'dashboard.ai_assistants.features.multi_course.title',
          descriptionKey: 'dashboard.ai_assistants.features.multi_course.description'
        }
      ],
      insightsFeatures: [
        {
          id: 1,
          icon: '📊',
          titleKey: 'dashboard.ai_assistants.features.learning_analytics.title',
          descriptionKey: 'dashboard.ai_assistants.features.learning_analytics.description'
        },
        {
          id: 2,
          icon: '🧠',
          titleKey: 'dashboard.ai_assistants.features.personalized_recommendations.title',
          descriptionKey: 'dashboard.ai_assistants.features.personalized_recommendations.description'
        }
      ],
      videoChatbotFeatures: [
        {
          id: 1,
          icon: '🎥',
          titleKey: 'dashboard.ai_assistants.features.learn_from_video.title',
          descriptionKey: 'dashboard.ai_assistants.features.learn_from_video.description'
        },
        {
          id: 2,
          icon: '💬',
          titleKey: 'dashboard.ai_assistants.features.realtime_qa.title',
          descriptionKey: 'dashboard.ai_assistants.features.realtime_qa.description'
        },
        {
          id: 3,
          icon: '🔍',
          titleKey: 'dashboard.ai_assistants.features.concept_breakdown.title',
          descriptionKey: 'dashboard.ai_assistants.features.concept_breakdown.description'
        },
        {
          id: 4,
          icon: '📝',
          titleKey: 'dashboard.ai_assistants.features.auto_notes.title',
          descriptionKey: 'dashboard.ai_assistants.features.auto_notes.description'
        }
      ],
      courses: [
        { id: 1, name: 'Deep Learning', progress: 75 },
        { id: 2, name: 'Software Engineering', progress: 60 },
        { id: 3, name: 'Software Testing', progress: 85 }
      ],
      recentActivities: [
        { id: 1, type: 'submission', icon: '📝', titleKey: 'dashboard.activities.submitted_assignment', params: { number: 2 }, timestamp: '2 hours ago' },
        { id: 2, type: 'quiz', icon: '✍️', titleKey: 'dashboard.activities.completed_quiz', params: { number: 3 }, timestamp: '1 day ago' },
        { id: 3, type: 'study', icon: '📚', titleKey: 'dashboard.activities.study_session', params: { hours: 2 }, timestamp: '2 days ago' }
      ],
      facultyList: [
        { id: 1, name: 'Dr. Smith - Deep Learning' },
        { id: 2, name: 'Prof. Johnson - Software Engineering' },
        { id: 3, name: 'Dr. Williams - AI' }
      ],
      isTimerRunning: false,
      timerSeconds: 0,
      timerInterval: null,
      quickLinks: [
        { id: 1, icon: '📚', labelKey: 'dashboard.quick_links.library', url: '/library' },
        { id: 2, icon: '📝', labelKey: 'dashboard.quick_links.notes', url: '/notes' },
        { id: 3, icon: '📅', labelKey: 'dashboard.quick_links.calendar', url: '/calendar' },
        { id: 4, icon: '📊', labelKey: 'dashboard.quick_links.grades', url: '/grades' },
        { id: 5, icon: '💬', labelKey: 'dashboard.quick_links.forums', url: '/forums' },
        { id: 6, icon: '📧', labelKey: 'dashboard.quick_links.messages', url: '/messages' }
      ]
    }
  },
  created() {
    this.fetchDeadlines();
    this.checkAuthentication();
  },
  methods: {
    logoutUser() {
      // Remove the authentication token
      localStorage.removeItem("authToken");

      // Redirect to sign-in page with a success message
      this.$router.push({ path: "/signin", query: { message: "logged_out" } });
    },

    getAuthToken() {
  // Retrieve the JWT token from localStorage
    return localStorage.getItem('authToken');
  },

    checkAuthentication() {
      const token = this.getAuthToken();
      if (!token) {
        this.$router.push('/signin');
      }
    },

    fetchDeadlines() {
      this.isLoadingDeadlines = true;
      this.deadlineError = null;

      // Get the authentication token from localStorage or wherever you store it
      const token = localStorage.getItem('authToken');

      axios.get('http://127.0.0.1:3000/student/deadline', {
        headers: {
          'Authorization': token
        }
      })
      .then(response => {
        const deadlinesData = response.data.deadlines;

        // Process the deadlines and calculate days left
        this.upcomingDeadlines = deadlinesData.map((deadline, index) => {
          // Parse the deadline date
          const deadlineDate = this.parseDeadlineDate(deadline.deadline);
          const today = new Date();

          // Calculate days left
          const timeDiff = deadlineDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

          return {
            id: index + 1, // Generate an ID if not provided by the API
            title: deadline.title,
            course: deadline.course,
            daysLeft: daysLeft,
            date: deadline.deadline
          };
        });

        // Sort deadlines by days left (closest first)
        this.upcomingDeadlines.sort((a, b) => a.daysLeft - b.daysLeft);

        // Filter out past deadlines
        this.upcomingDeadlines = this.upcomingDeadlines.filter(deadline => deadline.daysLeft >= 0);
      })
      .catch(error => {
        console.error('Error fetching deadlines:', error);
        this.deadlineError = 'Failed to load deadlines. Please try again later.';
      })
      .finally(() => {
        this.isLoadingDeadlines = false;
      });
    },
    parseDeadlineDate(dateString) {
      // Parse date in 'dd-mm-yyyy' format
      const [day, month, year] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
    },
    setRating(value) {
      this.rating = value;
    },
    navigateToChatbot() {
      this.$router.push('/chatbot');
    },
    navigateToInsights() {
      this.$router.push('/student/insights');
    },
    navigateToVideoChatbot() {
      this.$router.push('/student/videochatbot');
    },
    navigateToFeedback() {
      this.$router.push('/feedback');
    },
    toggleTimer() {
      if (this.isTimerRunning) {
        clearInterval(this.timerInterval);
      } else {
        this.timerInterval = setInterval(() => {
          this.timerSeconds++;
        }, 1000);
      }
      this.isTimerRunning = !this.isTimerRunning;
    },
    formatTime(seconds) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  },
  beforeDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
</script>

<style>
.dashboard-container {
  min-height: 100vh;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header-content {
  display: flex;
  align-items: center;
  max-width: 100%;
  margin: auto;
  margin-bottom: 2rem;
}

.dashboard-content {
  position: relative;
  z-index: 10;
  max-width: 1280px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin-bottom: 0.5rem;
}
.title-section {
  flex-grow: 1;
}

.title-regular {
  color: var(--text-dark);
}

.title-fancy {
  font-family: 'Pacifico', cursive;
  background: linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247));
  -webkit-background-clip: text;
  color: transparent;
}

.dashboard-subtitle {
  color: var(--text-secondary-dark);
  font-size: 1rem;
}
.primary-btn {
  background-image: linear-gradient(to right, rgb(99,102,241), rgb(168,85,247));
  color: white;
  border-radius: 0.5rem;
  padding: 0.75rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.3s ease;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.stat-trend {
  font-size: 0.9rem;
  color: var(--text-secondary-dark);
}

.stat-trend.positive {
  color: #10B981;
}

/* AI Assistants Grid */
.ai-assistants-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.view-all-btn {
  color: rgb(99, 102, 241);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

/* Deadlines */
.deadline-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.deadline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
}

.deadline-date.urgent {
  color: #EF4444;
}

/* Progress Bars */
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247));
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Activities */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

/* Recommendations */
.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
}

.action-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247));
  border: none;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .ai-assistants-grid {
    grid-template-columns: 1fr;
  }

  .progress-bar {
    width: 150px;
  }
}

/* Light Mode Adjustments */
.light-mode .dashboard-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.light-mode .stat-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.light-mode .deadline-item,
.light-mode .activity-item,
.light-mode .recommendation-item {
  background: rgba(0, 0, 0, 0.03);
}

.light-mode .progress-bar {
  background: rgba(0, 0, 0, 0.1);
}

/* Handbook Assistant Card Styles */
.handbook-assistant-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
}

/* AI Insights Card Styles */
.ai-insights-card {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(14, 165, 233, 0.1));
}

/* Video Chatbot Card Styles */
.video-chatbot-card {
  grid-column: 1 / -1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(239, 68, 68, 0.1));
}

.chatbot-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
  align-items: center;
}

.feature-icon {
  font-size: 1.5rem;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.feature-info h4 {
  margin: 0 0 0.5rem 0;
}

.feature-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary-dark);
}

/* Feedback Card Styles */
.feedback-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feedback-select {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
}

.feedback-input {
  min-height: 100px;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  resize: vertical;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.star-rating {
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 1.5rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.2);
}

.star.active {
  color: #FFD700;
}

/* Light Mode Adjustments */
.light-mode .feature-item,
.light-mode .feedback-select,
.light-mode .feedback-input {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.1);
}

.light-mode .star {
  color: rgba(0, 0, 0, 0.2);
}

.light-mode .star.active {
  color: #FFD700;
}

/* Timer Card Styles */
.timer-content {
  text-align: center;
  padding: 1rem 0;
}

.timer-display {
  font-size: 2.5rem;
  font-weight: bold;
  font-family: monospace;
  margin: 1rem 0;
  color: rgb(99, 102, 241);
}

.timer-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary-dark);
}

/* Quick Links Styles */
.links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.quick-link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.quick-link-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.05);
}

.link-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.link-label {
  font-size: 0.9rem;
}

/* Light Mode Adjustments */
.light-mode .quick-link-item {
  background: rgba(0, 0, 0, 0.03);
}

.light-mode .quick-link-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dashboard-footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.light-mode .dashboard-footer {
  color: var(--text-secondary-light);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
