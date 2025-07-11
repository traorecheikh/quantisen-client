<template>
  <div class="users-page">
    <header class="page-header">
      <h1>Users</h1>
      <p class="page-subtitle">Manage all user accounts and roles.</p>
    </header>
    <section class="users-section">
      <button class="app-btn app-btn-primary add-user-btn" type="button" @click="showAddUserModal = true">Add User</button>
      <div class="users-table-wrapper">
        <table class="app-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>gerant@example.com</td>
              <td>GERANT</td>
              <td>2023-10-27</td>
              <td>
                <button class="app-btn app-btn-danger app-btn-sm" type="button">Delete</button>
              </td>
            </tr>
            <tr>
              <td>employe@example.com</td>
              <td>EMPLOYE</td>
              <td>2023-11-01</td>
              <td>
                <button class="app-btn app-btn-danger app-btn-sm" type="button">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Add User Modal -->
      <div v-if="showAddUserModal" class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <h2>Add New User</h2>
            <button class="modal-close" @click="showAddUserModal = false">&times;</button>
          </div>
          <form class="modal-form">
            <div class="form-group">
              <label for="user-email">Email</label>
              <input id="user-email" type="email" class="app-input" placeholder="Enter user email" />
            </div>
            <div class="form-group">
              <label for="user-password">Password</label>
              <input id="user-password" type="password" class="app-input" placeholder="Enter password" />
            </div>
            <div class="form-group">
              <label for="user-role">Role</label>
              <select id="user-role" class="app-input">
                <option value="EMPLOYE">Employé</option>
                <option value="LIVREUR">Livreur</option>
              </select>
            </div>
            <button class="app-btn app-btn-primary" type="button">Create User</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const showAddUserModal = ref(false);
// No logic yet
</script>

<style scoped>
.users-page {
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
.users-section {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(79,70,229,0.08);
  padding: 32px 24px;
}
.add-user-btn {
  margin-bottom: 24px;
  float: right;
}
.users-table-wrapper {
  overflow-x: auto;
}
.app-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}
.app-table th, .app-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  text-align: left;
}
.app-table th {
  color: #4f46e5;
  font-weight: 600;
  font-size: 1rem;
}
.app-table td {
  color: #111827;
  font-size: 1rem;
}
.app-btn {
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  transition: background 0.2s;
}
.app-btn-primary {
  background: #4f46e5;
  color: #fff;
}
.app-btn-danger {
  background: #ef4444;
  color: #fff;
}
.app-btn-sm {
  padding: 6px 12px;
  font-size: 0.9rem;
}
.app-btn-primary:hover {
  background: #3730a3;
}
.app-btn-danger:hover {
  background: #b91c1c;
}
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(79,70,229,0.16);
  padding: 32px 24px;
  min-width: 340px;
  max-width: 95vw;
  position: relative;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.modal-header h2 {
  font-size: 1.3rem;
  color: #4f46e5;
  font-weight: 600;
}
.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (max-width: 700px) {
  .users-section {
    padding: 16px 4px;
  }
  .app-table th, .app-table td {
    padding: 8px 8px;
  }
}
</style>
