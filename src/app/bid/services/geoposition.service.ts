import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeopositionService {

  public accuracy: number;
  public latitud: number;
  public longitud: number;
  public altitude: number;
  public altitudeAccuracy: number;
  public heading : number;
  public speed: number;
  
  private options: GeolocationOptions;

  constructor(private geo: Geolocation) {
    this.accuracy = 0;
    this.longitud = -90;
    this.latitud = 19;
    this.options = {};
    this.options.enableHighAccuracy = true;
    this.options.maximumAge = 1000;
    this.options.timeout = 1000;
  }

  getPosition(){
    return this.geo.watchPosition(this.options).subscribe((data: Geoposition) => {
      this.accuracy = data.coords.accuracy;
      this.longitud = data.coords.longitude;
      this.latitud = data.coords.latitude;
      this.altitude = data.coords.altitude;
      this.altitudeAccuracy = data.coords.altitudeAccuracy;
      this.heading = data.coords.heading;
      this.speed = data.coords.speed;
      console.log('Geoposition updated...');
    })
  }
}
