import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private plaform: Platform,
              private storage: Storage) {}

  public async save( key: string, value: any) {
    if (this.plaform.is('cordova')) {
      // celular
      this.storage.set(key, value);
    } else {
      // computadora
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public async get( key: string){
    if (this.plaform.is('cordova')) {
      // celular
      return this.storage.get(key).then(data => {
          return data;
      });
    } else {
      // computadora
      if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
      }
    }

    return null;
  }

  public clear(): void {
    this.storage.clear();
  }
  
}
