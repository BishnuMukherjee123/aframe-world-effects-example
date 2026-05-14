// Component that places cacti where the ground is clicked

export const tapPlaceComponent = {
  schema: {
    // Increased base scale significantly to ensure initial size is larger and premium
    min: {default: 25},
    max: {default: 30},
  },
  init() {
    const ground = document.getElementById('ground')
    this.prompt = document.getElementById('promptText')
    this.spawnedEl = null

    ground.addEventListener('click', (event) => {
      // If model is already spawned, ignore any further ground clicks completely
      if (this.spawnedEl) {
        return
      }

      // Dismiss the prompt text.
      if (this.prompt) {
        this.prompt.style.display = 'none'
      }

      // The raycaster gives a location of the touch in the scene
      const touchPoint = event.detail.intersection.point

      // Create new entity for the single object instance
      const newElement = document.createElement('a-entity')
      this.spawnedEl = newElement

      // Immediately disable raycasting against the ground plane so future finger gestures
      // (pinch-to-scale, rotate, drag) never trigger ground clicks or teleportation.
      ground.classList.remove('cantap')

      // Add a 0.5 meter vertical offset so the model floats above the ground
      newElement.setAttribute('position', `${touchPoint.x} ${touchPoint.y + 0.5} ${touchPoint.z}`)

      const randomYRotation = Math.random() * 360
      newElement.setAttribute('rotation', `0 ${randomYRotation} 0`)

      const targetScale = Math.floor(Math.random() * (Math.floor(this.data.max) - Math.ceil(this.data.min)) + Math.ceil(this.data.min))

      newElement.setAttribute('visible', 'false')
      newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

      newElement.setAttribute('shadow', {
        receive: false,
      })

      // Add interactive class for raycaster targeting
      newElement.setAttribute('class', 'cantap')

      newElement.setAttribute('gltf-model', '#cactusModel')
      this.el.sceneEl.appendChild(newElement)

      newElement.addEventListener('model-loaded', () => {
        // Once the model is loaded, show it popping in with a smooth scale animation
        newElement.setAttribute('visible', 'true')
        newElement.setAttribute('animation', {
          property: 'scale',
          to: `${targetScale} ${targetScale} ${targetScale}`,
          easing: 'easeOutElastic',
          dur: 800,
        })
      })

      // Crucial: wait until the intro animation completes before attaching gesture components.
      // If added earlier, xrextras-pinch-scale natively caches the initial 0.0001 scale as its baseline,
      // causing the model to instantly shrink to invisibility on the first multi-touch pinch.
      newElement.addEventListener('animationcomplete', () => {
        newElement.removeAttribute('animation')
        newElement.setAttribute('scale', `${targetScale} ${targetScale} ${targetScale}`)

        // Dynamically initialize gesture handlers on the full visible scale baseline
        // newElement.setAttribute('xrextras-hold-drag', '') // Removed so it sticks in place
        newElement.setAttribute('xrextras-two-finger-rotate', '')
        newElement.setAttribute('xrextras-pinch-scale', 'min: 1; max: 3')
      })
    })
  },
}
