// Runs before the page is hydrated; only this fixed source is injected.
export const themeScript = `(function(){var t='system';try{t=localStorage.getItem('starter-ui-theme')||'system'}catch(e){}document.documentElement.classList.toggle('dark',t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))})();`;
