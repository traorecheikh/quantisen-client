<template>
  <div class="movements-page">
    <header class="page-header">
      <h1>Stock Movements</h1>
      <p class="page-subtitle">Log and review all stock movements and adjustments.</p>
    </header>
    <section class="movements-section">
      <form class="movement-form">
        <div class="form-row">
          <div class="form-group">
            <label for="beverage">Beverage</label>
            <select id="beverage" class="app-input">
              <option>Coca-Cola</option>
              <option>Fanta</option>
            </select>
          </div>
          <div class="form-group">
            <label for="type">Movement Type</label>
            <select id="type" class="app-input">
              <option>ENTREE</option>
              <option>SORTIE</option>
              <option>AJUSTEMENT</option>
            </select>
          </div>
          <div class="form-group">
            <label for="quantity">Quantity</label>
            <input id="quantity" type="number" class="app-input" placeholder="0" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="adjustment">Adjustment Type</label>
            <select id="adjustment" class="app-input">
              <option>CASSE</option>
              <option>VOL</option>
              <option>PERTE</option>
              <option>RETOUR_CLIENT</option>
            </select>
          </div>
          <div class="form-group" style="flex:2;">
            <label for="reason">Reason</label>
            <input id="reason" type="text" class="app-input" placeholder="Optional reason" />
          </div>
        </div>
        <button class="app-btn app-btn-primary" type="button">Record Movement</button>
      </form>
      <div class="movements-table-wrapper">
        <table class="app-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Beverage</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2023-11-01</td>
              <td>Coca-Cola</td>
              <td>ENTREE</td>
              <td>100</td>
              <td>gerant@example.com</td>
            </tr>
            <tr>
              <td>2023-11-02</td>
              <td>Fanta</td>
              <td>SORTIE</td>
              <td>20</td>
              <td>employe@example.com</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// No logic yet
</script>

<style scoped>
.movements-page {
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
.movements-section {
  max-width: 1100px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(79,70,229,0.08);
  padding: 32px 24px;
}
.movement-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}
.form-row {
  display: flex;
  gap: 24px;
}
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 12px 0;
  transition: background 0.2s;
  width: 200px;
  align-self: flex-end;
}
.app-btn-primary {
  background: #4f46e5;
  color: #fff;
}
.app-btn-primary:hover {
  background: #3730a3;
}
.movements-table-wrapper {
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
@media (max-width: 900px) {
  .movements-section {
    padding: 16px 4px;
  }
  .form-row {
    flex-direction: column;
    gap: 8px;
  }
  .app-table th, .app-table td {
    padding: 8px 8px;
  }
}
</style>

