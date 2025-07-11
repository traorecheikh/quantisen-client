<template>
  <div class="lots-page">
    <header class="page-header">
      <h1>Lots</h1>
      <p class="page-subtitle">Track all lots and their expiration dates.</p>
    </header>
    <section class="lots-section">
      <button class="app-btn app-btn-primary add-lot-btn" type="button" @click="showAddLotModal = true">Add Lot</button>
      <div class="lots-table-wrapper">
        <table class="app-table">
          <thead>
            <tr>
              <th>Lot Number</th>
              <th>Beverage</th>
              <th>Initial Qty</th>
              <th>Current Qty</th>
              <th>Entry Date</th>
              <th>Expiration Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Example rows, replace with dynamic data later -->
            <tr>
              <td>LOT-001</td>
              <td>Coca-Cola</td>
              <td>100</td>
              <td>80</td>
              <td>2023-10-01</td>
              <td>2024-01-01</td>
              <td>
                <button class="app-btn app-btn-primary app-btn-sm" type="button" @click="openEditLotModal('LOT-001')">Edit</button>
              </td>
            </tr>
            <tr>
              <td>LOT-002</td>
              <td>Fanta</td>
              <td>120</td>
              <td>120</td>
              <td>2023-11-10</td>
              <td>2024-02-10</td>
              <td>
                <button class="app-btn app-btn-primary app-btn-sm" type="button" @click="openEditLotModal('LOT-002')">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Add Lot Modal -->
      <div v-if="showAddLotModal" class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <h2>Add New Lot</h2>
            <button class="modal-close" @click="showAddLotModal = false">&times;</button>
          </div>
          <form class="modal-form">
            <div class="form-group">
              <label for="lot-beverage">Beverage</label>
              <select id="lot-beverage" class="app-input">
                <option>Coca-Cola</option>
                <option>Fanta</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="lot-initial">Initial Quantity</label>
                <input id="lot-initial" type="number" class="app-input" placeholder="e.g. 100" />
              </div>
              <div class="form-group">
                <label for="lot-current">Current Quantity</label>
                <input id="lot-current" type="number" class="app-input" placeholder="e.g. 100" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="lot-entry">Entry Date</label>
                <input id="lot-entry" type="date" class="app-input" />
              </div>
              <div class="form-group">
                <label for="lot-expiration">Expiration Date</label>
                <input id="lot-expiration" type="date" class="app-input" />
              </div>
            </div>
            <button class="app-btn app-btn-primary" type="button">Create Lot</button>
          </form>
        </div>
      </div>
      <!-- Edit Lot Modal -->
      <div v-if="showEditLotModal" class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <h2>Edit Lot</h2>
            <button class="modal-close" @click="showEditLotModal = false">&times;</button>
          </div>
          <form class="modal-form">
            <div class="form-group">
              <label for="edit-lot-number">Lot Number</label>
              <input id="edit-lot-number" type="text" class="app-input" :value="editLotNumber" disabled />
            </div>
            <div class="form-group">
              <label for="edit-lot-beverage">Beverage</label>
              <select id="edit-lot-beverage" class="app-input">
                <option>Coca-Cola</option>
                <option>Fanta</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="edit-lot-initial">Initial Quantity</label>
                <input id="edit-lot-initial" type="number" class="app-input" placeholder="e.g. 100" />
              </div>
              <div class="form-group">
                <label for="edit-lot-current">Current Quantity</label>
                <input id="edit-lot-current" type="number" class="app-input" placeholder="e.g. 100" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="edit-lot-entry">Entry Date</label>
                <input id="edit-lot-entry" type="date" class="app-input" />
              </div>
              <div class="form-group">
                <label for="edit-lot-expiration">Expiration Date</label>
                <input id="edit-lot-expiration" type="date" class="app-input" />
              </div>
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
const showAddLotModal = ref(false);
const showEditLotModal = ref(false);
const editLotNumber = ref('');
function openEditLotModal(lotNumber: string) {
  editLotNumber.value = lotNumber;
  showEditLotModal.value = true;
}
// No logic yet
</script>

<style scoped>
.lots-page {
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
.lots-section {
  max-width: 1100px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(79,70,229,0.08);
  padding: 32px 24px;
}
.add-lot-btn {
  margin-bottom: 24px;
  float: right;
}
.lots-table-wrapper {
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
  .lots-section {
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
