import { Component, OnInit } from '@angular/core';
import { ItemModel } from './_models/item.model';
import { Observable, Subject,throwError, of , BehaviorSubject} from 'rxjs';
import { ItemsService } from './_services/items.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  items$: BehaviorSubject<ItemModel[]>;
  // currentViewType: string;
  // showCompleted : boolean;
  constructor(
    private itemsService: ItemsService
  ) { }

  ngOnInit() {
    this.itemsService.getAll()
    this.items$  = this.itemsService.items$;
    // this.currentViewType = this.itemsService.currentViewType;
    // this.showCompleted = this.itemsService.showCompleted;
  }

  hasItems(items: ItemModel[]): boolean {
    return items && items.length > 0 ? true : false;
  }

  // changeView(){
  //   if(this.currentViewType == 'new'){
  //     this.currentViewType = 'completed';
  //     this.itemsService.currentViewType = 'completed';
  //   }else{
  //     this.currentViewType = 'new';
  //     this.itemsService.currentViewType = 'new';
  //   }
  //   // if(this.showCompleted == false){
  //   //   this.showCompleted = true;
  //   //   this.itemsService.showCompleted = true;
  //   // }
  //   // console.log("Clicked");
  // }

}
