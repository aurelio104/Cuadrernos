document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const totalMarkers = 22;

  for (let i = 0; i < totalMarkers; i++) {
    const entity = document.createElement("a-entity");
    entity.setAttribute("mindar-image-target", `targetIndex: ${i}`);
    entity.setAttribute("mindar-video-handler", "");
    scene.appendChild(entity);
  }

  console.log("✅ Entidades de marcador creadas");
});
