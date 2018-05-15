import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class ChatService {
  private API_ENDPOINT: string = 'http://api.simple-crm/api';
  
  constructor(private http: HttpClient) { }

}