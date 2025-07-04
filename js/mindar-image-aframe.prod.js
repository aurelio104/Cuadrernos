AFRAME.registerComponent('mindar-video-handler', {
  init: function () {
    const el = this.el;
    const markerId = parseInt(el.getAttribute('mindar-image-target').targetIndex, 10);
    const videoId = `video-${markerId + 1}`;
    const markerInfo = document.getElementById("marker-info");
    const startButton = document.getElementById("start-ar");

    let videoEl = null;
    let plane = null;

    el.addEventListener('targetFound', () => {
      console.log(`✅ Marcador detectado: ${markerId}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ${markerId}`;

      videoEl = document.getElementById(videoId);
      if (!videoEl) {
        console.warn(`⚠️ No se encontró el video con ID: ${videoId}`);
        return;
      }

      startButton.style.display = "block";
      startButton.onclick = async () => {
        startButton.style.display = "none";

        if (!plane) {
          plane = document.createElement('a-video');
          plane.setAttribute('src', `#${videoId}`);
          plane.setAttribute('width', '1');
          plane.setAttribute('height', '1.5');
          plane.setAttribute('position', '0 0 0');
          plane.setAttribute('rotation', '0 0 0');
          el.appendChild(plane);
        }

        try {
          await videoEl.play();
          console.log(`▶️ Video ${videoId} reproduciéndose`);
        } catch (err) {
          console.warn(`⚠️ Error al reproducir ${videoId}`, err);
        }
      };
    });

    el.addEventListener('targetLost', () => {
      console.log(`🕳️ Marcador perdido: ${markerId}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ---`;
      startButton.style.display = "none";

      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
  }
});

// Auto-inicialización: crea las entidades automáticamente
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
