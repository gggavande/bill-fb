import { Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, getDocs, getFirestore, query, updateDoc, where } from '@angular/fire/firestore';
import { CollectionReference, DocumentData,collection, } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Bill } from '../shared/bill'

@Injectable({
  providedIn: 'root'
})
export class BillService {
  abc : any;
  billCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.billCollection = collection(this.firestore, 'bills');

  }

  getAll() {
    console.log('get all call');
    return collectionData(this.billCollection, {
      idField: 'id',
    }) as Observable<Bill[]>;
  }

  async getAllByCustomerId(id : any) {
    const db = getFirestore();
    const q = query(collection(db, "bills"), where("customerId", "==", id));

    return await getDocs(q);
  }

  get(id: string) {
    const billDocumentReference = doc(this.firestore, `bills/${id}`);
    return docData(billDocumentReference, { idField: 'id' });
  }

  create(bill: Bill) {
    delete bill.id;
    return addDoc(this.billCollection, bill);
  }

  update(bill: Bill) {
    const billDocumentReference = doc(
      this.firestore,
      `bill/${bill.id}`
    );
    return updateDoc(billDocumentReference, { ...bill });
  }

  delete(id: string) {
    const billDocumentReference = doc(this.firestore, `bill/${id}`);
    return deleteDoc(billDocumentReference);
  }

}
