import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData:undefined | product;
  productQuantity:number = 1;
  quantity:number=1;

  constructor(private activatedRoute:ActivatedRoute,private product:ProductService) { }

  ngOnInit(): void {
    let productId = this.activatedRoute.snapshot.paramMap.get('productId');
    productId && this.product.getProduct(productId).subscribe((result:product)=>{
      this.productData = result;
    } );
  }

  handleQuantity(val:string){
    if(this.productQuantity<20 && val === 'add'){
      this.productQuantity+=1;
    }else if(this.productQuantity>1 && val === 'min'){
      this.productQuantity-=1;
    }
  }

}
