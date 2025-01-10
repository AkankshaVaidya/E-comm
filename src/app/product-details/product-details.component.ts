import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product;
  productQuantity: number = 1;
  quantity: number = 1;
  removeCart: boolean = false;
  cartData: product | undefined;

  constructor(private activatedRoute: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {
    let productId = this.activatedRoute.snapshot.paramMap.get('productId');
    productId && this.product.getProduct(productId).subscribe((result: product) => {
      this.productData = result;

      let cartData = localStorage.getItem('localCart');
      if (productId && cartData) {
        let items = JSON.parse(cartData);
        items = items.filter((item: product) =>productId== item.id.toString());
        if (items.length) {
          this.removeCart = true;
        }
        else {
          this.removeCart = false;
        }
      }

      let user = localStorage.getItem('user');
      if (user) {
        let userId = user && JSON.parse(user).id;
        this.product.getCartList(userId);
        this.product.cartData.subscribe((result) => {
          let items = result.filter((item: product) => productId?.toString() === item.productId?.toString())
          if (items.length) {
            this.cartData = items[0];
            this.removeCart = true;
          }
        })
      }


    });
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'add') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

  addToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        this.product.localAddToCart(this.productData)
        this.removeCart = true;
      } else {
        console.warn('User is  logged in');
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        //console.warn(userId);
        let cartData: cart = {
          ...this.productData,
          userId,
          productId: this.productData.id
        }
        delete cartData.id;
        console.warn(cartData);
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCartList(userId);
            this.removeCart = true;
          }
        });
      }
    }
  }

  removeToCart(productId: number) {
    if (!localStorage.getItem('user')) {
      this.product.removeItemFromCart(productId)
    } else {
      this.cartData && this.product.removeToCart(productId).subscribe((result) => {
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;
            this.product.getCartList(userId);
            
        })
      this.removeCart = false;
    }

  }

}
