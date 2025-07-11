<template>
  <div class="stocks-page">
    <header class="page-header">
      <h1>Stocks</h1>
      <p class="page-subtitle">Monitor current stock levels for all beverages.</p>
    </header>
    <section class="stocks-section">
      <div class="stocks-table-wrapper">
        <table class="app-table">
          <thead>
            <tr>
              <th>Beverage Name</th>
              <th>Total Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Coca-Cola</td>
              <td>180</td>
            </tr>
            <tr>
              <td>Fanta</td>
              <td>120</td>
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
.stocks-page {
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
.stocks-section {
  max-width: 700px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(79,70,229,0.08);
  padding: 32px 24px;
}
.stocks-table-wrapper {
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
@media (max-width: 700px) {
  .stocks-section {
    padding: 16px 4px;
  }
  .app-table th, .app-table td {
    padding: 8px 8px;
  }
}
</style>

