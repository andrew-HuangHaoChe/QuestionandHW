import Vue from 'vue';
import VueRouter from 'vue-router';
//官方元件
// import Home from '@/components/HelloWorld';
import Login from '@/components/pages/Login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';
import orderList from '@/components/pages/orderList';
import Discount from '@/components/pages/Discount';
import Mockorder from '@/components/pages/Mockorder';
Vue.use(VueRouter);

export default new VueRouter({
  routes:[
      {
        path:'*',
        redirect:'login',
      },
      // {
      //   path:'/index',
      //   name:'首頁',
      //   component:Home,
      //   meta: { requiresAuth: true },
      // },

      {
          path:'/login',
          name:'Login',
          component: Login,
      },
      {
        path:'/admin',
        name:'後臺管理頁',
        component: Dashboard,
        meta: { requiresAuth: true },
        children:[
          {
            path:'products',
            name:'Products',
            component: Products,
            meta: { requiresAuth: true },
          },
          {
            path:'orderList',
            name:'訂單列表',
            component: orderList,
            meta: { requiresAuth: true },
          },
          {
            path:'Discount',
            name:'優惠券',
            component: Discount,
            meta: { requiresAuth: true },
          },
        ],
      },
      {
          path:'/',
          name:'Dashboard',
          component: Dashboard,
          children:[
          {
            path:'Mockorder',
            name:'模擬訂單',
            component: Mockorder,
          },
        ],
      },
  ],  
});