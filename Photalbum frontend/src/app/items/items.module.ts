import { AuthGuard } from './../_auth/guards/auth.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ItemAddEditComponent } from './item-add-edit/item-add-edit.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { ItemsListItemComponent } from './items-list-item/items-list-item.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { ItemsComponent } from './items.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


const routes: Routes = [
  { path: 'items', component: ItemsComponent  },
  { path: 'item-edit/:id', component: ItemEditComponent  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    Ng2SearchPipeModule
  ],
  declarations: [
    ItemsComponent,
    ItemsListComponent,
    ItemsListItemComponent,
    ItemEditComponent,
    ItemAddEditComponent,
  ]
})
export class ItemsModule { }
