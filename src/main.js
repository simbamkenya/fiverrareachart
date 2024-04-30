import App from './App.svelte';
window.process = {
	...window.process,
  };

const app = new App({
	target: document.body,
	name: 'simba'
});

export default app;