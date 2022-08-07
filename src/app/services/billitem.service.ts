import { Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, getDocs, getFirestore, query, updateDoc, where } from '@angular/fire/firestore';
import { CollectionReference, DocumentData,collection, } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Billitem } from '../shared/billItem'

@Injectable({
  providedIn: 'root'
})
export class BillitemService {
  abc : any;
  billItemCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.billItemCollection = collection(this.firestore, 'bill_items');

  }

  getAll() {
    console.log('get all call');
    return collectionData(this.billItemCollection, {
      idField: 'id',
    }) as Observable<Billitem[]>;
  }

  get(id: string) {
    const billItemDocumentReference = doc(this.firestore, `bill_items/${id}`);
    return docData(billItemDocumentReference, { idField: 'id' });
  }

  async getAllByBillId(id : any) {
    const db = getFirestore();
    const q = query(collection(db, "bill_items"), where("billId", "==", id));

    return await getDocs(q);
  }

  getByBillId(id: string) {
    const billItemDocumentReference = doc(this.firestore, `bill_items/${id}`);
    return docData(billItemDocumentReference, { idField: 'billId' });
  }

  create(billItem: Billitem) {
    delete billItem.id;
    return addDoc(this.billItemCollection, billItem);
  }

  update(billItem: Billitem) {
    let id = billItem.id;
    delete billItem.id;
    const billItemDocumentReference = doc(
      this.firestore,
      `bill_items/${id}`
    );
    return updateDoc(billItemDocumentReference, { ...billItem });
  }

  delete(id: string) {
    const billItemDocumentReference = doc(this.firestore, `bill_items/${id}`);
    return deleteDoc(billItemDocumentReference);
  }

}
