AFRAME.registerComponent('mindar-video-handler', {
  init: function () {
    const el = this.el;
    const markerAttr = el.getAttribute('mindar-image-target');
    const markerId = parseInt(markerAttr?.targetIndex || 0, 10);

    const videoId = `video-${markerId + 1}`;
    const videoSrc = `assets/videos/video${markerId + 1}.mp4`;
    const markerInfo = document.getElementById("marker-info");

    let videoEl = null;
    let plane = null;
    let isVideoReady = false;

    const createAndPlayVideo = async () => {
      if (isVideoReady) return;
      isVideoReady = true;

      // Crear <video> dinámicamente
      videoEl = document.createElement("video");
      videoEl.setAttribute("id", videoId);
      videoEl.setAttribute("src", videoSrc);
      videoEl.setAttribute("loop", true);
      videoEl.setAttribute("muted", true);
      videoEl.setAttribute("playsinline", true);
      videoEl.setAttribute("webkit-playsinline", true);
      videoEl.setAttribute("crossorigin", "anonymous");
      videoEl.style.display = "none";
      document.body.appendChild(videoEl);

      // Crear plano AR <a-video>
      plane = document.createElement("a-video");
      plane.setAttribute("src", `#${videoId}`);
      plane.setAttribute("width", "1");
      plane.setAttribute("height", "1.5");
      plane.setAttribute("position", "0 0 0");
      plane.setAttribute("rotation", "0 0 0");
      el.appendChild(plane);

      try {
        await videoEl.play();
        console.log(`▶️ Reproduciendo video ${videoId}`);
      } catch (err) {
        console.warn(`⚠️ Error al reproducir ${videoId}:`, err);
      }
    };

    el.addEventListener('targetFound', () => {
      console.log(`✅ Marcador detectado: ${markerId}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ${markerId}`;
      createAndPlayVideo();
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

// Inicializar marcadores cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const totalMarkers = 22;

  if (!scene) {
    console.error("❌ No se encontró <a-scene> en el DOM");
    return;
  }

  scene.addEventListener('loaded', () => {
    setTimeout(() => {
      const canvas = scene.canvas;
      if (!canvas) {
        console.error("❌ Canvas no inicializado");
        return;
      }

      // Manejar pérdida de contexto WebGL
      canvas.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        console.warn("⚠️ WebGL context perdido");
        alert("El sistema AR se interrumpió. Por favor recarga.");
      });

      // Validar WebGL context activo
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        console.warn("❌ WebGL no disponible al cargar escena");
        alert("No se pudo iniciar WebGL. Recarga la página.");
        return;
      }

      console.log("✔️ WebGL context activo");

      // Inyectar entidades por marcador
      for (let i = 0; i < totalMarkers; i++) {
        const entity = document.createElement("a-entity");
        entity.setAttribute("mindar-image-target", `targetIndex: ${i}`);
        entity.setAttribute("mindar-video-handler", "");
        scene.appendChild(entity);
      }

    }, 100); // pequeño retraso para asegurar canvas válido
  });
});
