import { Component, OnInit } from '@angular/core';
import { Observable, Subject,throwError, of , BehaviorSubject} from 'rxjs';

import { ItemsService } from '../_services/items.service';
import { ItemModel } from '../_models/item.model';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {

  items$: BehaviorSubject<ItemModel[]>;
  searchText: any;
  currentUserTodos : any;

  constructor(
    private itemsService: ItemsService
  ) { }

  ngOnInit() {
    this.requiredItem()
    this.items$  = this.itemsService.items$;
    this.setItemDetails();
  }

  requiredItem(){
      // this.itemsService.items$.value.forEach((item)=>{
      //   console.log(item)
      //   console.log(localStorage.getItem('userDetail'))
      //   const userData = localStorage.getItem('userDetail')
      //   console.log(JSON.parse(userData).id);
      // })
      let currentUserId = JSON.parse(localStorage.getItem('userDetails'))
        // console.log(currentUserId);
      currentUserId = currentUserId.id
      localStorage.setItem('userId',currentUserId)
      let result = this.itemsService.items$.value.filter((item) => {
        return item.user == currentUserId
      })
      this.itemsService.items$.next(result)
  }

  setItemDetails(){
    if(localStorage.getItem('listOfTodos') === null){
      let listOfItems = this.items$.value.toLocaleString()
      localStorage.setItem('listOfTodos',listOfItems)
      // console.log(this.items$);

    }
  }

}
