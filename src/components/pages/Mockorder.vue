<template>
    <div> 
        <loading :active.sync="isLoading"></loading>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
                <div class="card border-0 shadow-sm">
                  <div style="height: 150px; background-size: cover; background-position: center" :style="{ backgroundImage:`url(${item.imageUrl})` }"
                    >
                  </div>
                  <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
                    <h5 class="card-title">
                      <a href="#" class="text-dark">{{item.title}}</a>
                    </h5>
                    <p class="card-text">{{item.content}}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                      <div class="h5" v-if="!item.price">{{item.origin_price}} 元</div>
                      <del class="h6">原價 {{item.origin_price}} 元</del>
                      <div class="h5">現在只要 {{item.price}} 元</div>
                    </div>
                  </div>
                  <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getproduct(item.id)">
                      <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                      查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
                      <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                      加到購物車
                    </button>
                  </div>
                </div>
              </div>
        </div>
        <div class="table-responsive-md mx-auto mt-4" style="width:500px;">
            <table class="table">
                <thead>
                    <th></th>
                    <th>品名</th>
                    <th class="text-center" width="100">數量</th>
                    <th class="text-center" width="120">單價</th>
                </thead>
                <tbody>
                   <tr v-for="commodity in cart.carts" :key="commodity.id">
                        <td><a @click.preventDefault=""><i class="far fa-trash-alt"></i></a></td>
                        <td>{{ commodity.product.title }}</td>
                        <td class="text-center">{{ commodity.qty }}</td>
                        <td class="text-right">{{ commodity.final_total | currency }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <td colspan="4" class="text-right">總計: {{cart.total}}</td>
                </tfoot>
            </table>
        </div>
         <!--Modal-->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-light border-0">
                        <h5 class="modal-title" id="exampleModalLabel">{{product.title}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body pt-0">
                        <div class="row  px-3">
                            <img :src="product.imageUrl" class="img-fluid mx-auto" style="height: 450px; width: 100%;" alt="">
                            <blockquote class="blockquote">
                                <p class="mb-0">{{product.content}}</p>
                                <footer class="blockquote-footer">{{product.description}}</footer>
                            </blockquote>
                            <div class="d-flex justify-content-between align-items-baseline w-100">
                                <div class="h5" v-if="!product.price">{{product.origin_price}} 元</div>
                                <del class="h6" v-if="product.price">原價 {{product.origin_price}} 元</del>
                                <div class="h5" v-if="product.price">現在只要 {{product.price}} 元</div>
                            </div>
                            <select name="" class="from-control mt-3 w-100" v-model="product.num">
                                <option :value="num" v-for="num in 10" :key="num">
                                    選購{{num}} {{product.unit}}
                                </option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <div class="text-muted text-nowrap mr-3">
                                小計<strong>{{product.num * product.price}}</strong>元
                            </div>
                            <button type="button" class="btn btn-primary" @click="addtoCart(product.id, product.num)">
                                加到購物車
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import $ from 'jquery';
    export default{
        data(){
            return{
                cart:[],
                products:[],
                product:{},
                isLoading:false,
                status:{
                    loadingItem:'',
                }
            };
        },
        methods:{
            getproducts(page = 1){
                const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
                const vm = this;
                vm.isLoading = true;
                this.$http.get(api).then((response) => {
                console.log(response.data);
                vm.isLoading = false;
                vm.products = response.data.products;
                });
            },
            getproduct(id){
                const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
                const vm = this;
                vm.status.loadingItem = id;
                this.$http.get(api).then((response) => {
                    vm.product = response.data.product;
                    response.data.product.num = 1;
                    $('#productModal').modal('show');
                    console.log(response);
                    vm.status.loadingItem = '';
                });
            },
            addtoCart(id, qty = 1){
                const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
                const vm = this;
                vm.status.loadingItem = id;
                const cart = {
                    product_id: id,
                    qty, 
                }
                this.$http.post(api, {data: cart}).then((response) => {
                    console.log(response);
                    vm.status.loadingItem = '';
                    vm.getCart();
                    $('#productModal').modal('hide');
                });
                
            },
            getCart(){
                const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
                const vm = this;
                vm.isLoading = true;
                this.$http.get(api).then((response) => {
                console.log(response.data);
                vm.cart = response.data.data;
                vm.isLoading = false;
                });
            },
            total(){
                const vm = this;
                let arr = 0;
                for(let item in cart){
                    if(typeof vm.cart[item] ==='final_total'){
                        arr += vm.cart[item];
                    }  
                }
            },
        },
        created(){
            this.getproducts();
            this.getCart();
        }, 
    };
</script>