if (window.location.hash === '#/copy') {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div style="padding-top:20px;display:flex;justify-content:center;flex-direction:column;align-items:center;">
      <h1 style="text-align: center;">正在生成代码，请勿操作 ....</h1>
      <img src="./assets/images/copy-loading.jpg" alt="涩图" />
    <div>
  `
}
