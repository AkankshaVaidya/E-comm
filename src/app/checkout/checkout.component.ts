import { Component, OnInit } from '@angular/core';
import { order, product } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
totalPrice :number| undefined;

  constructor(private product: ProductService,private router:Router) { }

  ngOnInit(): void {
    this.product.updateCart().subscribe((result) => {
      let price = 0;
      result.forEach((item) => {
        if(item.quantity){
          price = price + (+item.price* +item.quantity);
        }
      })
      this.totalPrice=price+(price/10)+100-(price/10);
      
      console.warn(this.totalPrice);
      
    })
    
  }
  oderNow(data:{email:string,address:string,contact:string}){
   let user =localStorage.getItem('user');
   let userId=user && JSON.parse(user).id;

   if(this.totalPrice){
    let orderData:order={
      ...data,
      totalPrice:this.totalPrice,
      userId
    }
    this.product.orderNow(orderData).subscribe((result)=>{
      if(orderData){
        alert('order placed')

        this.router.navigate(['/my-orders']);
      }
      
    })
   }
   
  }
}
