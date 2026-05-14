(function(){
  function initCounters(){
    document.querySelectorAll('.textarea-wrapper').forEach(wrapper=>{
      const ta = wrapper.querySelector('textarea.textarea-field');
      if(!ta) return;
      if(wrapper.querySelector('.textarea-counter')) return;
      const max = parseInt(ta.getAttribute('maxlength') || ta.dataset.max || '200', 10);

      // Force max length to prevent further input (including paste scenarios)
      try { ta.maxLength = max; } catch (e) { ta.setAttribute('maxlength', max); }

      // Truncate if existing content exceeds limit
      if(ta.value && ta.value.length > max) ta.value = ta.value.slice(0, max);

      const counter = document.createElement('div');
      counter.className = 'textarea-counter';
      const update = ()=>{
        const len = ta.value.length;
        counter.textContent = `${len}/${max}`;
        if(len>max) counter.classList.add('over'); else counter.classList.remove('over');
      };
      update();
      wrapper.appendChild(counter);

      // Use input event to update count and provide secondary truncation protection after paste or programmatic assignment
      ta.addEventListener('input', ()=>{
        if(ta.value.length > max) ta.value = ta.value.slice(0, max);
        update();
      });
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCounters); else initCounters();
})();