class DateTimeObj {
  constructor(date) {
    if (!date) date = new Date();
    this._date = new Date(date);
    this.utcTime = this._date.getTime();
  }

  static toDateTimeObj(value, format = "auto") {
    let d;
    if (format === "auto") {
      d = new Date(value);
    } else {
      d = DateTimeObj.parseByFormat(value, format);
    }
    if (isNaN(d.getTime())) throw new Error("Date parse failed");
    return new DateTimeObj(d);
  }

  static parseByFormat(str, fmt) {
    const y = str.substr(fmt.indexOf("YYYY"), 4) || new Date().getFullYear();
    const M = str.substr(fmt.indexOf("MM"), 2) || 1;
    const D = str.substr(fmt.indexOf("DD"), 2) || 1;
    const h = str.substr(fmt.indexOf("hh"), 2) || 0;
    const m = str.substr(fmt.indexOf("mm"), 2) || 0;
    const s = str.substr(fmt.indexOf("ss"), 2) || 0;
    return new Date(y, +M - 1, D, h, m, s);
  }

  format(fmt = "YYYY-MM-DD hh:mm:ss") {
    const d = this._date;
    const YYYY = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const DD = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return fmt
      .replace(/YYYY/g, YYYY)
      .replace(/MM/g, MM)
      .replace(/DD/g, DD)
      .replace(/hh/g, hh)
      .replace(/mm/g, mm)
      .replace(/ss/g, ss);
  }

  get rel() {
    const now = Date.now();
    const diff = now - this.utcTime;
    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    return {
      toNow: () => {
        if (diff < minute) return "just now";
        if (diff < hour) return `${Math.floor(diff / minute)} min ago`;
        if (diff < day) return `${Math.floor(diff / hour)} h ago`;
        if (diff < month) return `${Math.floor(diff / day)} d ago`;
        if (diff < year) return `${Math.floor(diff / month)} mo ago`;
        return `${Math.floor(diff / year)} y ago`;
      }
    };
  }

  get isWeekday() {
    const day = this._date.getDay();
    return day >= 1 && day <= 5;
  }

  get isWeekend() {
    return !this.isWeekday;
  }

  get htmlDate() {
    return this.format("YYYY-MM-DD");
  }

  get localDate() {
    return this._date.toLocaleDateString();
  }

  get localTime() {
    return this._date.toLocaleTimeString();
  }

  get localDateTime() {
    return this._date.toLocaleString();
  }
}

let activePickerInstance = null;
let activeWrapper = null;

function closeAnyPanel() {
  const all = document.querySelectorAll('.dropdown-panel');
  all.forEach(p => p.classList.add('hidden'));
  if (activeWrapper) {
    activeWrapper.classList.remove('active');
    activeWrapper = null;
  }
  activePickerInstance = null;
}

class UnifiedDateRangePicker {
  constructor(opt) {
    this.container = opt.container;
    this.format = opt.format || 'YYYY-MM-DD';
    this.onChange = opt.onChange || (() => {});
    this.start = null;
    this.end = null;
    this.viewDate = new Date();
    this.render();
    this.bindOutside();
  }

  // 统一范围 → 返回 { start, end }
  getValue() {
    return {
      start: this.fmt(this.start),
      end: this.fmt(this.end)
    };
  }

  fmt(d) {
    if (!d) return '';
    const dt = new DateTimeObj(d);
    return dt.format(this.format);
  }

  isInRange(date) {
    if (!this.start || !this.end) return false;
    const time = date.getTime();
    const s = this.start.getTime();
    const e = this.end.getTime();
    return time > s && time < e;
  }

  render() {
    this.container.innerHTML = '';
    const root = document.createElement('div');
    root.className = 'date-time-picker';
    this.root = root;

    const wrap = document.createElement('div');
    wrap.className = 'picker-wrapper';

    const inputWrap = document.createElement('div');
    inputWrap.className = 'picker-trigger unified-range-input';
    
    const inpStart = document.createElement('input');
    inpStart.value = this.fmt(this.start);
    inpStart.readOnly = true;
    
    const split = document.createElement('div');
    split.className = 'split';
    split.textContent = ' ~ ';
    
    const inpEnd = document.createElement('input');
    inpEnd.value = this.fmt(this.end);
    inpEnd.readOnly = true;
    
    inputWrap.append(inpStart, split, inpEnd);
    this.inpStart = inpStart;
    this.inpEnd = inpEnd;

    const line = document.createElement('div');
    line.className = 'speed-line-input';

    const panel = document.createElement('div');
    panel.className = 'dropdown-panel hidden';
    this.panel = panel;

    const cal = document.createElement('div');
    cal.className = 'calendar-display';
    this.renderCal(cal);
    panel.append(cal);

    const bar = document.createElement('div');
    bar.className = 'confirm-bar';
    const ok = document.createElement('button');
    ok.textContent = 'OK';
    ok.onclick = (e) => {
      e.stopPropagation();
      closeAnyPanel();
      this.emit();
    };
    bar.append(ok);
    panel.append(bar);

    inputWrap.onclick = (e) => {
      e.stopPropagation();
      closeAnyPanel();
      wrap.classList.add('active');
      activeWrapper = wrap;
      this.panel.classList.remove('hidden');
      activePickerInstance = this;
    };

    panel.onclick = e => e.stopPropagation();
    wrap.append(inputWrap, line);
    root.append(wrap, panel);
    this.container.append(root);
  }

  renderCal(container) {
    container.innerHTML = '';
    const y = this.viewDate.getFullYear(), M = this.viewDate.getMonth();
    const header = document.createElement('div');
    header.className = 'calendar-header';
    
    const prev = document.createElement('span');
    prev.className = 'calendar-prev';
    prev.textContent = '<';
    prev.onclick = (e) => { 
      e.stopPropagation();
      this.viewDate.setMonth(this.viewDate.getMonth()-1); 
      this.renderCal(this.panel.querySelector('.calendar-display'));
    };
    
    const title = document.createElement('span');
    title.textContent = `${y}-${String(M+1).padStart(2,'0')}`;
    
    const next = document.createElement('span');
    next.className = 'calendar-next';
    next.textContent = '>';
    next.onclick = (e) => { 
      e.stopPropagation();
      this.viewDate.setMonth(this.viewDate.getMonth()+1); 
      this.renderCal(this.panel.querySelector('.calendar-display'));
    };
    
    header.append(prev, title, next);
    
    const week = document.createElement('div');
    week.className = 'calendar-week';
    'Sun Mon Tue Wed Thu Fri Sat'.split(' ').forEach(w => {
      const s = document.createElement('span');
      s.textContent = w;
      week.append(s);
    });
    
    const days = document.createElement('div');
    days.className = 'calendar-days';
    this.fillDays(days);
    container.append(header, week, days);
  }

  fillDays(container) {
    const y = this.viewDate.getFullYear(), M = this.viewDate.getMonth();
    const first = new Date(y, M, 1);
    const last = new Date(y, M+1, 0);
    const pad = first.getDay();
    
    for(let i=0;i<pad;i++) {
      const d = document.createElement('div');
      d.className = 'calendar-day other-month';
      container.append(d);
    }
    
    for(let day=1;day<=last.getDate();day++) {
      const d = document.createElement('div');
      d.className = 'calendar-day';
      d.textContent = day;
      
      const cur = new Date(y,M,day);
      const isStart = this.start && cur.getTime() === this.start.getTime();
      const isEnd = this.end && cur.getTime() === this.end.getTime();
      const inRange = this.isInRange(cur);
      
      if (isStart || isEnd) d.classList.add('active');
      if (inRange) d.classList.add('in-range');
      
      d.onclick = (e) => {
        e.stopPropagation();
        if (!this.start) {
          this.start = new Date(y,M,day);
        } else if (!this.end) {
          this.end = new Date(y,M,day);
          if (this.end < this.start) [this.start, this.end] = [this.end, this.start];
        } else {
          this.start = new Date(y,M,day);
          this.end = null;
        }
        this.inpStart.value = this.fmt(this.start);
        this.inpEnd.value = this.fmt(this.end);
        this.renderCal(this.panel.querySelector('.calendar-display'));
      };
      container.append(d);
    }
  }

  emit() {
    this.onChange(this.getValue());
  }

  bindOutside() {
    document.addEventListener('click', (e) => {
      if (this.root && !this.root.contains(e.target)) closeAnyPanel();
    });
  }
}

class DateTimePicker {
  constructor(opt) {
    this.format = opt.format || 'YYYY-MM-DD hh:mm:ss';
    this.container = opt.container;
    this.onChange = opt.onChange || (() => {});
    this.range = opt.range || false;
    this.needConfirm = opt.needConfirm || false;
    this.date1 = new Date();
    this.date2 = new Date();
    this.render();
  }
 
  getValue() {
    if (this.range) {
      return {
        start: this.fmt(this.date1),
        end: this.fmt(this.date2)
      };
    } else {
      return this.fmt(this.date1);
    }
  }

  fmt(d) {
    return new DateTimeObj(d).format(this.format);
  }

  createPicker(date) {
    const wrap = document.createElement('div');
    wrap.className = 'date-time-picker';

    const pickerWrap = document.createElement('div');
    pickerWrap.className = 'picker-wrapper';
    
    const input = document.createElement('input');
    input.className = 'picker-trigger';
    input.value = this.fmt(date);
    input.readOnly = true;
    
    const line = document.createElement('div');
    line.className = 'speed-line-input';
    
    const panel = document.createElement('div');
    panel.className = 'dropdown-panel hidden';
    
    const self = this;

    if (this.format.includes('YYYY')) {
      const cal = document.createElement('div');
      cal.className = 'calendar-display';
      this.renderCal(cal, date, input);
      panel.append(cal);
    }
    
    const timeBar = document.createElement('div');
    timeBar.className = 'time-select-bar';
    if (this.format.includes('hh')) this.addSel(timeBar, 'hour', date, input);
    if (this.format.includes('mm')) this.addSel(timeBar, 'minute', date, input);
    if (this.format.includes('ss')) this.addSel(timeBar, 'second', date, input);
    panel.append(timeBar);

    if (this.needConfirm) {
      const bar = document.createElement('div');
      bar.className = 'confirm-bar';
      const ok = document.createElement('button');
      ok.textContent = 'OK';
      ok.onclick = (e) => { 
        e.stopPropagation(); 
        closeAnyPanel(); 
        this.emit(); 
      };
      bar.append(ok);
      panel.append(bar);
    }
    
    input.onclick = e => {
      e.stopPropagation();
      closeAnyPanel();
      pickerWrap.classList.add('active');
      activeWrapper = pickerWrap;
      panel.classList.remove('hidden');
    };
    panel.onclick = e => e.stopPropagation();
    pickerWrap.append(input, line);
    wrap.append(pickerWrap, panel);
    return { wrap, input, panel };
  }

  addSel(container, type, date, input) {
    const sel = document.createElement('select');
    sel.className = 'time-part';
    const max = type === 'hour' ? 24 : 60;
    for (let i=0; i<max; i++) {
      const v = String(i).padStart(2,'0');
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      sel.append(opt);
    }
    sel.value = type === 'hour' ? String(date.getHours()).padStart(2,'0') :
               type === 'minute' ? String(date.getMinutes()).padStart(2,'0') :
               String(date.getSeconds()).padStart(2,'0');
    sel.onchange = () => {
      if (type === 'hour') date.setHours(+sel.value);
      else if (type === 'minute') date.setMinutes(+sel.value);
      else date.setSeconds(+sel.value);
      input.value = this.fmt(date);
      showDemo(date);
    };
    container.append(sel);
  }

  renderCal(container, date, input) {
    const now = date;
    const y = now.getFullYear(), M = now.getMonth();
    const header = document.createElement('div');
    header.className = 'calendar-header';
    
    const prev = document.createElement('span');
    prev.className = 'calendar-prev';
    prev.textContent = '<';
    prev.onclick = (e) => {
      e.stopPropagation();
      date.setMonth(date.getMonth() - 1);
      this.renderCal(container, date, input);
    };
    
    const title = document.createElement('span');
    title.textContent = `${y}-${String(M+1).padStart(2,'0')}`;
    
    const next = document.createElement('span');
    next.className = 'calendar-next';
    next.textContent = '>';
    next.onclick = (e) => {
      e.stopPropagation();
      date.setMonth(date.getMonth() + 1);
      this.renderCal(container, date, input);
    };
    
    header.append(prev, title, next);

    const week = document.createElement('div');
    week.className = 'calendar-week';
    'Sun Mon Tue Wed Thu Fri Sat'.split(' ').forEach(w => {
      const s = document.createElement('span');
      s.textContent = w;
      week.append(s);
    });
    
    const days = document.createElement('div');
    days.className = 'calendar-days';
    const first = new Date(y, M, 1);
    const last = new Date(y, M+1, 0);
    
    days.innerHTML = '';
    for (let i=0; i<first.getDay(); i++) days.append(document.createElement('div'));
    for (let d=1; d<=last.getDate(); d++) {
      const el = document.createElement('div');
      el.className = 'calendar-day';
      el.textContent = d;
      if (date.getDate() === d) el.classList.add('active');
      el.onclick = () => {
        date.setDate(d);
        input.value = this.fmt(date);
        showDemo(date);
        this.renderCal(container, date, input);
      };
      days.append(el);
    }
    container.innerHTML = '';
    container.append(header, week, days);
  }

  emit() {
    this.onChange(this.getValue());
  }

  render() {
    this.container.innerHTML = '';
    if (this.range) {
      const root = document.createElement('div');
      root.className = 'range-picker';
      const left = this.createPicker(this.date1);
      const right = this.createPicker(this.date2);
      const split = document.createElement('span');
      split.className = 'range-split';
      split.textContent = '~';
      root.append(left.wrap, split, right.wrap);
      this.container.append(root);
    } else {
      const p = this.createPicker(this.date1);
      this.container.append(p.wrap);
    }
  }
}

//function showDemo(date) {
//  const dt = new DateTimeObj(date);
//  document.getElementById("demo1").textContent = `Raw String: ${dt.format()}`;
//  document.getElementById("demo2").textContent = `UTC Time: ${dt._date.toISOString()}`;
//  document.getElementById("demo3").textContent = `Local Date: ${dt.localDate}`;
//  document.getElementById("demo4").textContent = `Local Time: ${dt.localTime}`;
//  document.getElementById("demo5").textContent = `Local DateTime: ${dt.localDateTime}`;
//  document.getElementById("demo6").textContent = `HTML Standard: ${dt.htmlDate}`;
//  document.getElementById("demo7").textContent = `Is Weekday: ${dt.isWeekday ? "Yes" : "No"}`;
//  document.getElementById("demo8").textContent = `Is Weekend: ${dt.isWeekend ? "Yes" : "No"}`;
//  document.getElementById("demo9").textContent = `Relative Time: ${dt.rel.toNow()}`;
//}
//
//// 实例化
//const picker1 = new DateTimePicker({ container: picker1, format: 'YYYY-MM-DD hh:mm:ss', needConfirm: true });
//const picker2 = new DateTimePicker({ container: picker2, format: 'YYYY/MM/DD hh:mm' });
//const picker3 = new DateTimePicker({ container: picker3, format: 'YYYY-MM-DD' });
//const picker4 = new DateTimePicker({ container: picker4, format: 'MM/DD/YYYY' });
//const dateRangePicker = new DateTimePicker({ container: dateRangePicker, format: 'YYYY-MM-DD', range: true });
//const timeRangePicker = new DateTimePicker({ container: timeRangePicker, format: 'hh:mm:ss', range: true });
//const unifiedRangePicker = new UnifiedDateRangePicker({ container: unifiedRangePicker, format: 'YYYY-MM-DD' });
//
//setInterval(()=>{
//  showDemo(new Date());
//},1000)