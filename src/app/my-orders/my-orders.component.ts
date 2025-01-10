import { Component, OnInit } from '@angular/core';
import { order, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  
  oderData:order[]|undefined;

  constructor(private product:ProductService) { }

  ngOnInit(): void {
   this.getOrderList();
  }

  getOrderList(){
    this.product.orderList().subscribe((result)=>{
      this.oderData = result;
  })
  }

  cancelOrder(orderId:number | undefined){
    orderId && this.product.cancelOrder(orderId).subscribe((result)=>{
      this.getOrderList();
    })
  }

}
