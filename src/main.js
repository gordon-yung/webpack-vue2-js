const Vue = require('vue');

const App = Vue.extend({
  data() {
    return {
      features: [
        'Webpack 5 负责模块打包',
        'Vue 2 提供界面渲染能力',
        'JavaScript 作为默认开发语言',
      ],
    };
  },
  render(h) {
    return h('main', { class: 'page' }, [
      h('h1', 'webpack + Vue 2 + JavaScript'),
      h('p', '项目基础结构已经搭建完成，可直接在此基础上继续开发业务功能。'),
      h(
        'ul',
        { class: 'feature-list' },
        this.features.map((feature) => h('li', feature))
      ),
    ]);
  },
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
