// Declara AFRAME global para TypeScript
declare const AFRAME: any



document.addEventListener('DOMContentLoaded', () => {
  const markerInfo = document.getElementById('marker-info')
  const camError = document.getElementById('cam-error')
  const camVideo = document.getElementById('mindar-video') as HTMLVideoElement | null

  if (!camVideo) {
    console.error('❌ El elemento #mindar-video no se encontró en el DOM.')
    return
  }

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

  const scene = document.querySelector('a-scene')
  if (scene) {
    scene.addEventListener('loaded', () => {
      console.log('✅ A-Frame scene loaded.')
    })
  }

  AFRAME.registerComponent('debug-log', {
    init() {
      console.log('✅ A-Frame entity initialized:', this.el)
    }
  })

  AFRAME.registerComponent('marker-events', {
    init() {
      const el = this.el
      const targetIndex = el.getAttribute('mindar-image-target')?.targetIndex
      const videoId = `video${parseInt(targetIndex)}`
      const video = document.getElementById(videoId) as HTMLVideoElement | null

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
