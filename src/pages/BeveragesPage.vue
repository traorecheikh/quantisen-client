<template>
  <div class="beverages-page">
    <header class="page-header">
      <h1>Beverages</h1>
      <p class="page-subtitle">View and manage all beverage products.</p>
    </header>
    <section class="beverages-section">
      <button class="app-btn app-btn-primary add-beverage-btn" type="button" @click="showAddBeverageModal = true">Add Beverage</button>
      <div class="beverages-table-wrapper">
        <table class="app-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Volume</th>
              <th>Unit</th>
              <th>Stock Threshold</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Example rows, replace with dynamic data later -->
            <tr>
              <td>Coca-Cola</td>
              <td>Classic soda</td>
              <td>1.5</td>
              <td>330</td>
              <td>ml</td>
              <td>50</td>
              <td>
                <button class="app-btn app-btn-primary app-btn-sm" type="button" @click="openEditBeverageModal('Coca-Cola')">Edit</button>
              </td>
            </tr>
            <tr>
              <td>Fanta</td>
              <td>Orange soda</td>
              <td>1.4</td>
              <td>330</td>
              <td>ml</td>
              <td>40</td>
              <td>
                <button class="app-btn app-btn-primary app-btn-sm" type="button" @click="openEditBeverageModal('Fanta')">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Add Beverage Modal -->
      <div v-if="showAddBeverageModal" class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <h2>Add New Beverage</h2>
            <button class="modal-close" @click="showAddBeverageModal = false">&times;</button>
          </div>
          <form class="modal-form">
            <div class="form-group">
              <label for="beverage-name">Name</label>
              <input id="beverage-name" type="text" class="app-input" placeholder="Enter beverage name" />
            </div>
            <div class="form-group">
              <label for="beverage-description">Description</label>
              <input id="beverage-description" type="text" class="app-input" placeholder="Enter description" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="beverage-price">Price</label>
                <input id="beverage-price" type="number" class="app-input" placeholder="0.00" />
              </div>
              <div class="form-group">
                <label for="beverage-volume">Volume</label>
                <input id="beverage-volume" type="number" class="app-input" placeholder="e.g. 330" />
              </div>
              <div class="form-group">
                <label for="beverage-unit">Unit</label>
                <select id="beverage-unit" class="app-input">
                  <option value="ml">ml</option>
                  <option value="cl">cl</option>
                  <option value="L">L</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="beverage-seuil">Stock Threshold</label>
              <input id="beverage-seuil" type="number" class="app-input" placeholder="e.g. 50" />
            </div>
            <button class="app-btn app-btn-primary" type="button">Create Beverage</button>
          </form>
        </div>
      </div>
      <!-- Edit Beverage Modal -->
      <div v-if="showEditBeverageModal" class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <h2>Edit Beverage</h2>
            <button class="modal-close" @click="showEditBeverageModal = false">&times;</button>
          </div>
          <form class="modal-form">
            <div class="form-group">
              <label for="edit-beverage-name">Name</label>
              <input id="edit-beverage-name" type="text" class="app-input" :value="editBeverageName" disabled />
            </div>
            <div class="form-group">
              <label for="edit-beverage-description">Description</label>
              <input id="edit-beverage-description" type="text" class="app-input" placeholder="Enter description" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="edit-beverage-price">Price</label>
                <input id="edit-beverage-price" type="number" class="app-input" placeholder="0.00" />
              </div>
              <div class="form-group">
                <label for="edit-beverage-volume">Volume</label>
                <input id="edit-beverage-volume" type="number" class="app-input" placeholder="e.g. 330" />
              </div>
              <div class="form-group">
                <label for="edit-beverage-unit">Unit</label>
                <select id="edit-beverage-unit" class="app-input">
                  <option value="ml">ml</option>
                  <option value="cl">cl</option>
                  <option value="L">L</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="edit-beverage-seuil">Stock Threshold</label>
              <input id="edit-beverage-seuil" type="number" class="app-input" placeholder="e.g. 50" />
            </div>
            <button class="app-btn app-btn-primary" type="button">Save Changes</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const showAddBeverageModal = ref(false);
const showEditBeverageModal = ref(false);
const editBeverageName = ref('');
function openEditBeverageModal(name: string) {
  editBeverageName.value = name;
  showEditBeverageModal.value = true;
}
// No logic yet
</script>

<style scoped>
.beverages-page {
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
.beverages-section {
  max-width: 1100px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(79,70,229,0.08);
  padding: 32px 24px;
}
.add-beverage-btn {
  margin-bottom: 24px;
  float: right;
}
.beverages-table-wrapper {
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
.app-btn-sm {
  padding: 6px 12px;
  font-size: 0.9rem;
}
.app-btn-primary:hover {
  background: #3730a3;
}

/* Modal styles */
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
.form-row {
  display: flex;
  gap: 16px;
}
@media (max-width: 700px) {
  .beverages-section {
    padding: 16px 4px;
  }
  .app-table th, .app-table td {
    padding: 8px 8px;
  }
  .form-row {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
