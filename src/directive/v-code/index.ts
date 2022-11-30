const vCode = {
  mounted(el: HTMLElement) {
    // 获取代码片段
    const code = el.querySelector('code.hljs');
    const pre = el.getElementsByTagName('pre')[0];
    const html = code?.innerHTML;
    const size = (html as any).split('\n').length;

    // 插入行数
    const ul = document.createElement('ul');
    for (let i = 1; i <= size; i += 1) {
      const li = document.createElement('li');
      li.innerText = `${i}`;
      ul.appendChild(li);
    }

    ul.classList.add('hljs-code-number');

    el.insertBefore(ul, pre);
  },
};

export default vCode;
