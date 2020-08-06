<template>
  <div>       
  <loading :active.sync="isLoading"></loading>
       <table class="table mt-4">
          <thead>
              <th width="120">分類</th>
              <th>產品名稱</th>
              <th width="120">原價</th>
              <th width="120">售價</th>
              <th width="100">是否啟用</th>
              <th width="80">編輯</th>
          </thead>
          <tbody>
              <tr v-for="item in products" :key="item.id">
                  <td>{{item.category}}</td>
                  <td>{{item.title}}</td>
                  <td class="text-right">{{item.origin_price | currency}}</td>
                  <td class="text-right">{{item.price | currency}}</td>
                  <td>
                      <span v-if="item.is_enabled" class="text-success">啟用</span>
                      <span v-else>未啟用</span>
                  </td>
                  <td>
                      <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
                      <button class="btn btn-outline-primary btn-sm" @click="opendeleteModal(item)">刪除</button>
                  </td>
              </tr>
          </tbody>
      </table>
      
      <Pagination :pages="pagination" @pageChange="getProducts"></Pagination>
    

</div>
</template>



<script>
import $ from 'jquery';
import Pagination from '../Pagination';
export default {
  components:{
    Pagination,
  },
    data(){
        return {
            products:[],
            pagination:{},
            tempProduct:{},
            isNew:false,
            isLoading: false,
            status:{
              fileUploading:false,
            },
        };
    },
    methods:{
        getProducts(page = 1){  //page = 1(ES6用法)帶入預設值為第一頁，他如果有帶數值就會用後來傳入的數值作替代。
            const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
            const vm = this;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
            console.log(response.data);
            vm.isLoading = false;
            vm.products = response.data.products;
            vm.pagination = response.data.pagination;
            });
        },
        uploadFile(){
          const uploadedFile = this.$refs.files.files[0];
          const vm = this;
          const formData = new FormData();
          formData.append('file-to-upload', uploadedFile);
          const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
          vm.status.fileUploading = true;
          this.$http.post(url, formData, {
            headers:{
              'Content-Type': 'multipart/form-data',
            },
          }).then((response) => {
            console.log(response.data);
            vm.status.fileUploading = false;
            if(response.data.success){
              vm.$set(vm.tempProduct, 'imageUrl' ,response.data.imageUrl);
            }else{
              this.$bus.$emit('message:push', response.data.message, 'danger');
            }
          });
        },
    },
    created() {
        this.getProducts();  
    },
    
}
</script>
