/**
 * Words switcher
 * @example
 * <span class="words-switcher">
 *   word 1 | word 2 | multiple words 3
 * </span>
 */
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.getElementsByClassName('words-switcher')
  const totalElements = elements.length

  if (totalElements === 0) {
    return
  }

  const {
    showClassName,
    hideClassName,
    entryClassName,
    exitClassName,
    startClassName
  } = getClasses()
  const baseElement = document.createElement('span')

  for (let index = 0; index < totalElements; index++) {
    const element = elements[index]
    const content = element.innerHTML
    const wordElements = getWordElements({
      content,
      baseElement,
      startClassName,
      hideClassName
    })

    element.innerHTML = ''
    element.appendChild(wordElements)

    switchWords ({
      element,
      timeout: 1500,
      showClassName,
      hideClassName,
      entryClassName,
      exitClassName
    })
  }
})

/**
 * Switch words, one by one
 * @param {HTMLElement} element
 * @param {number} timeout
 * @param {string} showClassName
 * @param {string} hideClassName
 * @param {string} entryClassName
 * @param {string} exitClassName
 * @returns {void}
 */
function switchWords ({
  element,
  timeout,
  showClassName,
  hideClassName,
  entryClassName,
  exitClassName
}) {
  const childNodes = element.childNodes
  const totalChildNodes = childNodes.length
  const lastChildNodeIndex = totalChildNodes - 1

  for (let index = 0; index < totalChildNodes; index++) {
    const childNode = childNodes[index]
    const nextIndex = index + 1

    if (nextIndex > lastChildNodeIndex) {
      break
    }

    const nextChildNode = childNodes[nextIndex]

    childNode.addEventListener('animationend', () => {
      if (childNode.classList.contains(entryClassName)) {
        const timeoutId = window.setTimeout(() => {
          childNode.classList.replace(entryClassName, exitClassName)

          window.clearTimeout(timeoutId)
        }, timeout)
      } else if (childNode.classList.contains(exitClassName)) {
        childNode.classList.remove(exitClassName)
        childNode.classList.replace(showClassName, hideClassName)

        nextChildNode.classList.replace(hideClassName, showClassName)
        nextChildNode.classList.add(entryClassName)
      }
    })
  }
}

/**
 * Retrieve word elements
 * @private
 * @param {string} content
 * @param {HTMLElement} baseElement
 * @param {string} startClassName
 * @param {string} hideClassName
 * @returns {DocumentFragment}
 */
function getWordElements ({
  content,
  baseElement,
  startClassName,
  hideClassName
}) {
  const words = content.split('|')
  const fragmentEl = document.createDocumentFragment()

  words.forEach((word, index) => {
    const wordEl = baseElement.cloneNode()

    wordEl.innerText = word
    wordEl.className = index === 0 ? startClassName : hideClassName

    fragmentEl.appendChild(wordEl)
  })

  return fragmentEl
}

/**
 * Retrieve classes
 * @param {string} prefix
 * @returns {object}
 */
function getClasses (prefix = 'ws') {
  const showClassName = `${prefix}-show`
  const hideClassName = `${prefix}-hide`
  const entryClassName = `${prefix}-flip-in`
  const exitClassName = `${prefix}-flip-out`

  return {
    showClassName,
    hideClassName,
    entryClassName,
    exitClassName,
    startClassName: `${showClassName} ${entryClassName}`,
    endClassName: `${hideClassName} ${exitClassName}`
  }
}
