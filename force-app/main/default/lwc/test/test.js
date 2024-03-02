import { LightningElement } from 'lwc';

export default class Test extends LightningElement {
name="test"
age=30
 addToPehla(e){
    this.name=e.target.value
} 



}