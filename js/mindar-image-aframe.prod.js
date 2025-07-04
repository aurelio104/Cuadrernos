AFRAME.registerComponent('mindar-video-handler', {
  init: function () {
    const el = this.el;
    const markerAttr = el.getAttribute('mindar-image-target');
    const markerId = parseInt(markerAttr.targetIndex || markerAttr['targetIndex'], 10);
    const videoId = `video-${markerId + 1}`;
    const markerInfo = document.getElementById("marker-info");

    let videoEl = null;
    let plane = null;

    el.addEventListener('targetFound', async () => {
      console.log(`✅ Marcador detectado: ${markerId}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ${markerId}`;

      // Obtener el video desde <a-assets>
      videoEl = document.getElementById(videoId);
      if (!videoEl) {
        console.warn(`🎥 Video ${videoId} no encontrado en <a-assets>`);
        return;
      }

      // Crear plano si no existe
      if (!plane) {
        plane = document.createElement('a-video');
        plane.setAttribute('src', `#${videoId}`);
        plane.setAttribute('width', '1');
        plane.setAttribute('height', '1.5');
        plane.setAttribute('position', '0 0 0');
        plane.setAttribute('rotation', '0 0 0');
        el.appendChild(plane);
      }

      // Intentar reproducir
      try {
        await videoEl.play();
        console.log(`▶️ Reproduciendo ${videoId}`);
      } catch (err) {
        console.warn(`⚠️ Error al reproducir ${videoId}`, err);
      }
    });

    el.addEventListener('targetLost', () => {
      console.log(`🕳️ Marcador perdido: ${markerId}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ---`;
      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
  }
});

// 🧱 Cargar automáticamente los 22 targets al iniciar
document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const totalMarkers = 22;

  for (let i = 0; i < totalMarkers; i++) {
    const entity = document.createElement('a-entity');
    entity.setAttribute('mindar-image-target', `targetIndex: ${i}`);
    entity.setAttribute('mindar-video-handler', '');
    scene.appendChild(entity);
  }
});
