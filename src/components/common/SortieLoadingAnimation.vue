<template>
  <div class="sortie-loading-overlay">
    <div class="loading-container">
      <div class="fifo-animation">
        <!-- Stack of boxes representing lots -->
        <div class="lot-stack">
          <div
            v-for="(lot, index) in animationLots"
            :key="index"
            class="lot-box"
            :class="{ 'processing': lot.processing, 'processed': lot.processed }"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <div class="lot-content">
              <div class="lot-number">{{ lot.number }}</div>
              <div class="lot-date">{{ lot.date }}</div>
            </div>
          </div>
        </div>

        <!-- FIFO Arrow -->
        <div class="fifo-arrow">
          <div class="arrow-body"></div>
          <div class="arrow-head"></div>
        </div>

        <!-- Processing indication -->
        <div class="processing-indicator">
          <div class="spinner"></div>
          <div class="processing-text">
            <h3>Traitement FIFO en cours...</h3>
            <p>Optimisation des sorties par date d'expiration</p>
            <div class="progress-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Background particles -->
      <div class="particles">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const animationLots = ref([
  { number: 'LOT001', date: '2025-01-15', processing: false, processed: false },
  { number: 'LOT002', date: '2025-02-20', processing: false, processed: false },
  { number: 'LOT003', date: '2025-03-10', processing: false, processed: false },
  { number: 'LOT004', date: '2025-04-05', processing: false, processed: false },
])

let animationInterval: NodeJS.Timeout | null = null

const getParticleStyle = (index: number) => {
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 3
  const left = Math.random() * 100
  const size = 2 + Math.random() * 4

  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
  }
}

const startAnimation = () => {
  let currentLot = 0

  animationInterval = setInterval(() => {
    if (currentLot < animationLots.value.length) {
      // Mark current lot as processing
      animationLots.value[currentLot].processing = true

      // After a delay, mark as processed
      setTimeout(() => {
        animationLots.value[currentLot].processing = false
        animationLots.value[currentLot].processed = true
        currentLot++
      }, 800)
    } else {
      // Reset animation
      currentLot = 0
      animationLots.value.forEach(lot => {
        lot.processing = false
        lot.processed = false
      })
    }
  }, 1000)
}

onMounted(() => {
  startAnimation()
})

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
})
</script>

<style scoped>
.sortie-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.loading-container {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.fifo-animation {
  position: relative;
  padding: 20px 0;
}

.lot-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.lot-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  padding: 15px;
  color: white;
  transform: translateX(0);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.lot-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.8s;
}

.lot-box.processing {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  transform: translateX(20px) scale(1.05);
  box-shadow: 0 10px 30px rgba(240, 147, 251, 0.4);
}

.lot-box.processing::before {
  left: 100%;
}

.lot-box.processed {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  transform: translateX(40px) scale(0.9);
  opacity: 0.7;
}

.lot-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lot-number {
  font-weight: bold;
  font-size: 0.9em;
}

.lot-date {
  font-size: 0.8em;
  opacity: 0.9;
}

.fifo-arrow {
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

.arrow-body {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  position: relative;
  animation: arrowPulse 2s infinite;
}

.arrow-head {
  width: 0;
  height: 0;
  border-left: 10px solid #764ba2;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  animation: arrowPulse 2s infinite;
}

@keyframes arrowPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.processing-indicator {
  margin-top: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.processing-text h3 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.2em;
  font-weight: 600;
}

.processing-text p {
  color: #666;
  margin: 0 0 15px 0;
  font-size: 0.9em;
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.progress-dots span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: dotPulse 1.4s infinite ease-in-out;
}

.progress-dots span:nth-child(1) { animation-delay: -0.32s; }
.progress-dots span:nth-child(2) { animation-delay: -0.16s; }
.progress-dots span:nth-child(3) { animation-delay: 0s; }

@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  animation: float linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .loading-container {
    padding: 30px 20px;
    margin: 20px;
  }

  .fifo-arrow {
    right: -40px;
  }

  .arrow-body {
    width: 30px;
  }

  .processing-text h3 {
    font-size: 1.1em;
  }

  .processing-text p {
    font-size: 0.8em;
  }
}
</style>
