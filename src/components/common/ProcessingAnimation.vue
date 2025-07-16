<template>
  <div class="processing-overlay">
    <div class="processing-container">
      <div class="processing-animation">
        <div class="processing-spinner"></div>
        <div class="processing-messages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="processing-message"
            :class="{ active: currentMessageIndex >= index }"
          >
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const messages = [
  'Traitement de l\'univers des données...',
  'Démantèlement des structures...',
  'Analyse des boissons...',
  'Validation des lots...',
  'Création des entrées...',
  'Finalisation du processus...'
]

const currentMessageIndex = ref(-1)
let messageInterval: NodeJS.Timeout | null = null

onMounted(() => {
  // Start showing messages with a delay
  messageInterval = setInterval(() => {
    if (currentMessageIndex.value < messages.length - 1) {
      currentMessageIndex.value++
    }
  }, 800) // Change message every 800ms for at least 5 seconds total
})

onUnmounted(() => {
  if (messageInterval) {
    clearInterval(messageInterval)
  }
})
</script>

<style scoped>
.processing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.processing-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.processing-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.processing-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.processing-messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 200px;
}

.processing-message {
  font-size: 1rem;
  color: #6b7280;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.processing-message.active {
  opacity: 1;
  transform: translateY(0);
  color: #1f2937;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
