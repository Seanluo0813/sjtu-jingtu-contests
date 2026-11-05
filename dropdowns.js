(() => {
  'use strict';

  const selectIds = ['category', 'grade', 'format', 'calendarYear'];
  const controls = new Map();
  let openControl = null;

  function close(control, restoreFocus = false) {
    if (!control) return;
    control.menu.hidden = true;
    control.wrapper.classList.remove('is-open', 'flip-up');
    control.trigger.setAttribute('aria-expanded', 'false');
    if (openControl === control) openControl = null;
    if (restoreFocus && !control.trigger.disabled) control.trigger.focus({preventScroll: true});
  }

  function enabledOptions(control) {
    return control.items.filter(item => !item.button.disabled && !item.button.hidden);
  }

  // Move only the menu's scroll position; scrolling the option into view directly
  // would also move the page beneath the fixed navigation bar.
  function focusOption(control, item) {
    if (!item) return;
    item.button.focus({preventScroll: true});
    const menuRect = control.menu.getBoundingClientRect();
    const optionRect = item.button.getBoundingClientRect();
    const top = menuRect.top + control.menu.clientTop;
    const bottom = top + control.menu.clientHeight;
    if (optionRect.top < top) control.menu.scrollTop -= top - optionRect.top;
    else if (optionRect.bottom > bottom) control.menu.scrollTop += optionRect.bottom - bottom;
  }

  function positionMenu(control) {
    const viewport = window.visualViewport;
    const viewportTop = viewport ? viewport.offsetTop : 0;
    const viewportHeight = viewport ? viewport.height : window.innerHeight;
    const viewportBottom = viewportTop + viewportHeight;
    const triggerRect = control.trigger.getBoundingClientRect();
    const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom || 0;
    const above = Math.max(0, triggerRect.top - Math.max(viewportTop, headerBottom) - 12);
    const below = Math.max(0, viewportBottom - triggerRect.bottom - 12);
    const desiredHeight = Math.min(320, viewportHeight * .5, control.menu.scrollHeight);
    const flip = below < desiredHeight && above > below;
    control.wrapper.classList.toggle('flip-up', flip);
    control.menu.style.maxHeight = `${Math.floor(Math.min(320, viewportHeight * .5, flip ? above : below))}px`;
  }

  function open(control, edge) {
    if (control.trigger.disabled) return;
    if (openControl && openControl !== control) close(openControl);
    refreshControl(control);
    const options = enabledOptions(control);
    if (!options.length) return;
    openControl = control;
    control.menu.hidden = false;
    control.wrapper.classList.add('is-open');
    control.trigger.setAttribute('aria-expanded', 'true');
    positionMenu(control);
    const selected = options.find(item => item.optionIndex === control.native.selectedIndex);
    const item = edge === 'first' ? options[0] : edge === 'last' ? options.at(-1) : selected || options[0];
    focusOption(control, item);
  }

  function choose(control, item) {
    if (!item || item.button.disabled || control.native.disabled) return;
    const option = control.native.options[item.optionIndex];
    if (!option) return;
    const changed = control.native.value !== option.value;
    control.native.value = option.value;
    close(control, true);
    refreshControl(control);
    if (changed) control.native.dispatchEvent(new Event('change', {bubbles: true}));
  }

  function refreshControl(control) {
    const {native, trigger, value, menu, wrapper} = control;
    const label = native.getAttribute('aria-label') || native.labels?.[0]?.textContent.trim() || native.id;
    const options = Array.from(native.options);
    const signature = JSON.stringify(options.map(option => [
      option.value, option.label, option.disabled || option.parentElement?.disabled || false, option.hidden
    ]));
    const hadOptionFocus = menu.contains(document.activeElement);
    if (signature !== control.signature) {
      control.signature = signature;
      control.items = options.map((option, optionIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'select-option';
        button.tabIndex = -1;
        button.setAttribute('role', 'option');
        button.dataset.optionIndex = String(optionIndex);
        button.disabled = option.disabled || Boolean(option.parentElement?.disabled);
        button.hidden = option.hidden;
        const text = document.createElement('span');
        text.className = 'option-label';
        text.textContent = option.label;
        const check = document.createElement('span');
        check.className = 'option-check';
        check.setAttribute('aria-hidden', 'true');
        check.textContent = '✓';
        button.append(text, check);
        return {button, optionIndex};
      });
      menu.replaceChildren(...control.items.map(item => item.button));
    }
    const selectedText = options[native.selectedIndex]?.label || '请选择';
    value.textContent = selectedText;
    trigger.setAttribute('aria-label', `${label}：${selectedText}`);
    trigger.disabled = native.disabled || !enabledOptions(control).length;
    menu.setAttribute('aria-label', label);
    wrapper.classList.toggle('has-value', native.value !== '');
    control.items.forEach(item => item.button.setAttribute('aria-selected', String(item.optionIndex === native.selectedIndex)));
    if (trigger.disabled && openControl === control) close(control);
    else if (openControl === control) {
      positionMenu(control);
      if (hadOptionFocus && !menu.contains(document.activeElement)) {
        const options = enabledOptions(control);
        focusOption(control, options.find(item => item.optionIndex === native.selectedIndex) || options[0]);
      }
    }
  }

  function enhance(native) {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';
    wrapper.dataset.selectId = native.id;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    const value = document.createElement('span');
    value.className = 'select-value';
    const chevron = document.createElement('span');
    chevron.className = 'select-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.7');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'm6 9 6 6 6-6');
    svg.append(path);
    chevron.append(svg);
    trigger.append(value, chevron);
    const menu = document.createElement('div');
    menu.className = 'select-menu';
    menu.id = `${native.id}-listbox`;
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;
    trigger.setAttribute('aria-controls', menu.id);
    native.before(wrapper);
    wrapper.append(native, trigger, menu);
    native.classList.add('styled-select-native');
    native.tabIndex = -1;
    native.setAttribute('aria-hidden', 'true');

    const control = {native, wrapper, trigger, value, menu, items: [], signature: null};
    controls.set(native.id, control);
    refreshControl(control);
    trigger.addEventListener('click', () => openControl === control ? close(control, true) : open(control));
    trigger.addEventListener('keydown', event => {
      if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        open(control, event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : undefined);
      }
    });
    menu.addEventListener('click', event => {
      const button = event.target.closest('.select-option');
      if (button && menu.contains(button)) choose(control, control.items[Number(button.dataset.optionIndex)]);
    });
    wrapper.addEventListener('keydown', event => {
      if (openControl !== control) return;
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault();
        close(control, true);
        return;
      }
      if (!menu.contains(event.target)) return;
      const options = enabledOptions(control);
      const index = options.findIndex(item => item.button === document.activeElement);
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 :
          Math.max(0, Math.min(options.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)));
        focusOption(control, options[next]);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose(control, options[index]);
      }
    });
    native.addEventListener('change', () => refreshControl(control));
    return control;
  }

  function refresh() {
    selectIds.forEach(id => {
      const native = document.getElementById(id);
      if (!native) return;
      const control = controls.get(id);
      if (control) refreshControl(control);
      else enhance(native);
    });
  }

  document.addEventListener('pointerdown', event => {
    if (openControl && !openControl.wrapper.contains(event.target)) close(openControl);
  });
  document.addEventListener('focusin', event => {
    if (openControl && !openControl.wrapper.contains(event.target)) close(openControl);
  });
  function repositionOpenMenu() {
    if (!openControl) return;
    const rect = openControl.trigger.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportTop = viewport ? viewport.offsetTop : 0;
    const viewportBottom = viewportTop + (viewport ? viewport.height : window.innerHeight);
    const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom || 0;
    if (rect.top < Math.max(viewportTop, headerBottom) || rect.bottom > viewportBottom) {
      close(openControl);
      return;
    }
    positionMenu(openControl);
    focusOption(openControl, openControl.items.find(item => item.button === document.activeElement));
  }
  window.addEventListener('resize', repositionOpenMenu);
  window.addEventListener('scroll', repositionOpenMenu, {passive: true});
  window.visualViewport?.addEventListener('resize', repositionOpenMenu);
  window.visualViewport?.addEventListener('scroll', repositionOpenMenu);
  window.JingtuSelects = {refresh};
  refresh();
})();
