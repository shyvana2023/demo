(function(){
  function initCounters(){
    document.querySelectorAll('.textarea-wrapper').forEach(wrapper=>{
      const ta = wrapper.querySelector('textarea.textarea-field');
      if(!ta) return;
      if(wrapper.querySelector('.textarea-counter')) return;
      const max = parseInt(ta.getAttribute('maxlength') || ta.dataset.max || '200', 10);

      // 强制最大长度，阻止继续输入（包含粘贴场景）
      try { ta.maxLength = max; } catch (e) { ta.setAttribute('maxlength', max); }

      // 如果已有内容超出，截断
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

      // 使用 input 事件更新计数并在粘贴或程序赋值后做二次截断保护
      ta.addEventListener('input', ()=>{
        if(ta.value.length > max) ta.value = ta.value.slice(0, max);
        update();
      });
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCounters); else initCounters();
})();
