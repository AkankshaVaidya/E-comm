import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  constructor(private route:Router,private product:ProductService) { }

   menuType:String='default';
   sellerName:string='';
   searchResult:undefined | product[];

  ngOnInit(): void {
    this.route.events.subscribe((val:any)=>{
    if(val.url){
      if(localStorage.getItem('seller') && val.url.includes('seller')){
        console.warn('in seller area')
        this.menuType='seller';
        if(localStorage.getItem('seller')){
          let sellerStore=localStorage.getItem('seller');
          let sellerData =  sellerStore && JSON.parse(sellerStore)[0];
          this.sellerName=sellerData.name;
        }
      }else{
        console.warn('outside seller');
        this.menuType='default';
      }
    }
    })
  }

  logout(){
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
  }

  searchProduct(query:KeyboardEvent){
    if(query){
      const element =query.target as HTMLInputElement;
      this.product.searchProduct(element.value).subscribe((result)=>{
        console.warn(result);
        if(result.length>5){
             result.length=5;
        }
        
        this.searchResult=result;
      } )
    }
  }

  hideSearch(){
    this.searchResult=undefined;
  }

}
