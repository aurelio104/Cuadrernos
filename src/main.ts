// Declara AFRAME global para TypeScript
declare const AFRAME: any

import 'aframe'
import 'mind-ar/dist/mindar-image-aframe.prod.js'

document.addEventListener('DOMContentLoaded', () => {
  const markerInfo = document.getElementById('marker-info')
  const camError = document.getElementById('cam-error')
  const camVideo = document.getElementById('mindar-video') as HTMLVideoElement

  if (!camVideo) {
    console.error('❌ El elemento #mindar-video no se encontró en el DOM.')
    return
  }

  // 📷 Inicializar feed de cámara (iOS compatible)
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      camVideo.srcObject = stream
      return camVideo.play()
    })
    .then(() => {
      console.log('🎥 Cámara inicializada correctamente.')
    })
    .catch(err => {
      console.error('⚠️ Error al acceder a la cámara:', err)
      if (camError) camError.style.display = 'block'
    })

  // ✅ Confirmar carga de la escena A-Frame
  const scene = document.querySelector('a-scene')
  if (scene) {
    scene.addEventListener('loaded', () => {
      console.log('✅ A-Frame scene loaded.')
    })
  }

  // 🛠 Componente de depuración visual
  AFRAME.registerComponent('debug-log', {
    init() {
      console.log('✅ A-Frame entity initialized:', this.el)
    }
  })

  // 🧠 Componente de manejo de marcadores con reproducción de video
  AFRAME.registerComponent('marker-events', {
    init() {
      const el = this.el
      const targetIndex = el.getAttribute('mindar-image-target')?.targetIndex
      const videoId = `video${Number(targetIndex) + 1}`
      const video = document.getElementById(videoId) as HTMLVideoElement

      el.addEventListener('targetFound', () => {
        console.log(`🎯 Marcador detectado: targetIndex = ${targetIndex}`)
        if (markerInfo) markerInfo.textContent = `Marcador detectado ✅`

        if (video) {
          video.currentTime = 0
          video.play().catch(err => {
            console.warn(`⚠️ No se pudo reproducir ${videoId}:`, err)
          })
        }
      })

      el.addEventListener('targetLost', () => {
        console.log(`🕳️ Marcador perdido: targetIndex = ${targetIndex}`)
        if (markerInfo) markerInfo.textContent = 'Marcador: ---'

        if (video) {
          video.pause()
        }
      })
    }
  })
})
