import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject,throwError, of , BehaviorSubject} from 'rxjs';
import { map,mergeMap,switchMap ,catchError , tap} from 'rxjs/operators';

import { ItemModel } from '../_models/item.model';
import { AddItemModel } from '../_models/add-item.model';
import { UpdateItemModel } from '../_models/update-item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  // create a BehaviourSubject Observable with type ItemModel[] and default value []
  items$ = new BehaviorSubject<ItemModel[]>([]);

  constructor(
    private http: HttpClient,
  ) { }

  clear(): void {
    this.items$.next([]);
  }

  getAll(): ItemModel[] {
    return this.items$.getValue();
  }

  get(id: number): ItemModel {
    const currentItems: ItemModel[]  = this.getAll();
    if (currentItems.length === 0) {
      return null;
    }

    const index1  = currentItems.findIndex((element) => {
      return element.id === id;
    });
    return (index1 >= 0 && currentItems[index1]) ? currentItems[index1] : null;
  }

  delete(id: number, item:ItemModel): Observable<any> {
    item['is_delete']='TRUE'
    return this.http.post(environment['apiBaseUrl'] + 'api/v1/accounts/todos/update_data/', item)
      .pipe(
        map(data => {
            return (data && data == 'Updated Successfully') ? true : false;
          }
        ),
        tap((success) => { if (success) { this.deleteItem(id); }}), // when success, delete the item from the local service
        catchError((err) => {
          return of(false);
        }),
      );
  }

  fetchItem(id: number): Observable<any> {
    return this.http.get(environment['apiBaseUrl'] + '/api/item/' + id)
      .pipe(
        map(data => {
            return (data['success'] && data['success'] === true) ? data['result'] : false;
          }
        ),
        catchError((err) => {
          return of(false);
        }),
      );
  }

  update(id: number , payload: any, img: File): Observable<any> {
    payload['id'] = id;
    payload['is_delete'] = 'FALSE';
    const frmData = new FormData();
    const userId = localStorage.getItem('userId')
    frmData.append("img",img, img.name);
    frmData.set("user",userId);
    frmData.set("title",payload.title);
    frmData.set("description",payload.description);
    frmData.set("id",payload.id);
    frmData.set("is_delete",'False');
    return this.http.post(environment['apiBaseUrl'] + 'api/v1/accounts/todos/update_data/', frmData)

      .pipe(

        map(responseData => {
            return (responseData && responseData == 'Updated Successfully') ? payload : false;
          }

        ),

        tap(item => { if (item) {

          this.updateItem(id , item, img);
         }}), // when success result, update the item in the local service

        catchError(err => {

          return of(false);

        }),

      );

  }

  changeStatus(id: number , payload: any): Observable<any> {
    this.toggleStatus(payload);
    return this.http.post(environment['apiBaseUrl'] + 'api/v1/accounts/todos/update_data/', payload)
      .pipe(
        map(responseData => {
            return (responseData && responseData == 'Updated Successfully') ? payload : false;
          }
        ),
        tap(item => { if (item) {

          this.updateItem(id , item);
         }}), // when success result, update the item in the local service
        catchError(err => {
          return of(false);
        }),
      );
  }

  toggleStatus(payload: any){
    let currentStatus = payload.status;
    if(currentStatus == 'new'){
      currentStatus = 'completed'
      return payload.status = currentStatus
    }else{
      currentStatus = 'new'
      return payload.status = currentStatus
    }
  }

  add(payload: AddItemModel, img: File): Observable<any> {
    const frmData = new FormData();
    const userId = localStorage.getItem('userId')
    frmData.append("img",img, img.name);
    frmData.set("user",userId);
    frmData.set("title",payload.title);
    frmData.set("description",payload.description);
    console.log("UserId"+ userId)
    console.log(frmData);
    return this.http.post(environment['apiBaseUrl'] + 'api/v1/accounts/todos/' , frmData)
      .pipe(
        map(responseData => {
            console.log(responseData);
            return (responseData['success'] && responseData['success'] === true) ? responseData['result'] : false;
          }
        ),
        tap(item => { if (item) { this.addItem(item); }}), // when success, add the item to the local service
        // tap(item => { if (item) { this.fetch() }}), // when success, add the item to the local service
        catchError(err => {
          return of(false);
        }),
      );
  }

  deleteItem(id: number): boolean  {
    const currentItems: ItemModel[]  = this.getAll();
    if (currentItems.length > 0) {
      const index1  = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0 ) {
        currentItems.splice(index1, 1);
        this.items$.next(currentItems);
        return true;
      }
    }
    return false;
  }
  // Update the local page
  addItem(item: ItemModel): void {
    const currentItems: ItemModel[]  = this.getAll();
    item.status = 'new';
    currentItems.push(item);
    this.items$.next(currentItems);
  }

  updateItem(id: number , item: UpdateItemModel, img?:any): boolean {
    const currentItems: ItemModel[]  = this.getAll();
    if (currentItems.length > 0) {
      const index1  = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0 ) {
        currentItems[index1] = item;
        this.items$.next(currentItems);
        console.log(this.items$);

        return true;
      }
    }
    return false;
  }

  fetch(): Observable<any> {
    // debugger;
    this.clear();
    return this.http.get(environment['apiBaseUrl'] + 'api/v1/accounts/todos/')

  }

}
