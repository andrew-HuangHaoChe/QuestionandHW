<template>
  <div>       
  <loading :active.sync="isLoading"></loading>
      <table class="table mt-4">
        <thead>
          
        
        
        </thead>
        <tbody>
          <tr v-for="item in coupons" :key="item.id">
            
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
            coupons:[],
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
            const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
            const vm = this;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            // vm.isLoading = true;
            this.$http.get(api).then((response) => {
            console.log(response.data);
            //vm.isLoading = false;
            //vm.coupons = response.data.coupons;
            //vm.pagination = response.data.pagination;
            });
        },
        newCoupons(){
          const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
          const vm = this;
          vm.isLoading = true;
          this.$http.post(api).then((response) => {
            //if(response.data.success){
              //vm.getProducts();
           // }
          });
        },
        // uploadFile(){
        //   const uploadedFile = this.$refs.files.files[0];
        //   const vm = this;
        //   const formData = new FormData();
        //   formData.append('file-to-upload', uploadedFile);
        //   const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
        //   vm.status.fileUploading = true;
        //   this.$http.post(url, formData, {
        //     headers:{
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   }).then((response) => {
        //     console.log(response.data);
        //     vm.status.fileUploading = false;
        //     if(response.data.success){
        //       vm.$set(vm.tempProduct, 'imageUrl' ,response.data.imageUrl);
        //     }else{
        //       this.$bus.$emit('message:push', response.data.message, 'danger');
        //     }
        //   });
        // },
    },
    created() {
        this.getProducts();  
    },
    
}
</script>
