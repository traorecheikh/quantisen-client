<template>
  <div class="profile-page">
    <header class="page-header">
      <h1>Profile & Settings</h1>
      <p class="page-subtitle">Change your password below.</p>
    </header>
    <section class="profile-section">
      <form class="change-password-form">
        <div class="form-group">
          <label for="old-password">Old Password</label>
          <input id="old-password" type="password" class="app-input" placeholder="Enter old password" />
        </div>
        <div class="form-group">
          <label for="new-password">New Password</label>
          <input id="new-password" type="password" class="app-input" placeholder="Enter new password" />
        </div>
        <button class="app-btn app-btn-primary" type="button">Change Password</button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
// No logic yet
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 40px 0 0 0;
}
.page-header {
  text-align: center;
  margin-bottom: 32px;
}
.page-header h1 {
  font-size: 2rem;
  color: #4f46e5;
  font-weight: bold;
}
.page-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin-top: 8px;
}
.profile-section {
  max-width: 400px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(79,70,229,0.08);
  padding: 32px 24px;
}
.change-password-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-group label {
  font-size: 1rem;
  color: #111827;
  margin-bottom: 4px;
  display: block;
}
.app-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 1rem;
  background: #f9fafb;
  transition: border 0.2s;
}
.app-input:focus {
  border-color: #4f46e5;
  outline: none;
}
.app-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.app-btn-primary {
  background: #4f46e5;
  color: #fff;
}
.app-btn-primary:hover {
  background: #3730a3;
}
</style>

