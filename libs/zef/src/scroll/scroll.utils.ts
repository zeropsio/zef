export function getElementWindow(element: Element) {
  if (
    !element ||
    !element.ownerDocument ||
    !element.ownerDocument.defaultView
  ) {
    return window;
  }
  return element.ownerDocument.defaultView;
}

export function getElementDocument(element: Element) {
  if (!element || !element.ownerDocument) {
    return document;
  }
  return element.ownerDocument;
}

export function getElementOffset(el: Element) {
  const rect = el.getBoundingClientRect();
  const elDocument = getElementDocument(el);
  const elWindow = getElementWindow(el);

  return {
    top:
      rect.top +
      (elWindow.pageYOffset || elDocument.documentElement.scrollTop),
    left:
      rect.left +
      (elWindow.pageXOffset || elDocument.documentElement.scrollLeft)
  };
}

let cachedScrollbarWidth: number;

export function getScrollbarWidth() {
  if (cachedScrollbarWidth === undefined) {
    if (typeof document === 'undefined') {
      cachedScrollbarWidth = 0;
      return cachedScrollbarWidth;
    }

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    (outer.style as any).msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    outer.classList.add('u-hidden-scrollbar'); // set the same pseudo styles as the actual scroll component has

    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer?.parentNode?.removeChild(outer);

    cachedScrollbarWidth = scrollbarWidth;
  }

  return cachedScrollbarWidth;
}

export function getSafeScrollbarWidth(contentWrapperEl?: any) {
  // Try/catch for FF 56 throwing on undefined computedStyles
  try {
    // Detect browsers supporting CSS scrollbar styling and do not calculate
    if (
      getComputedStyle(contentWrapperEl || window.document.body, '::-webkit-scrollbar')
        .display === 'none' ||
      'scrollbarWidth' in document.documentElement.style ||
      '-ms-overflow-style' in document.documentElement.style
    ) {
      return 0;
    } else {
      return getScrollbarWidth();
    }
  } catch (e) {
    return getScrollbarWidth();
  }
}
