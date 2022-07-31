import { Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { CollectionReference, DocumentData,collection, } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Customer } from '../shared/customer'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  abc : any;
  customerCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.customerCollection = collection(this.firestore, 'customer');

  }

  getAll() {
    console.log('get all call');
    return collectionData(this.customerCollection, {
      idField: 'id',
    }) as Observable<Customer[]>;
  }

  get(id: string) {
    const pokemonDocumentReference = doc(this.firestore, `pokemon/${id}`);
    return docData(pokemonDocumentReference, { idField: 'id' });
  }

  create(customer: Customer) {
    return addDoc(this.customerCollection, customer);
  }

  update(customer: Customer) {
    const pokemonDocumentReference = doc(
      this.firestore,
      `pokemon/${customer.customerId}`
    );
    return updateDoc(pokemonDocumentReference, { ...customer });
  }

  delete(id: string) {
    const pokemonDocumentReference = doc(this.firestore, `customer/${id}`);
    return deleteDoc(pokemonDocumentReference);
  }

}
