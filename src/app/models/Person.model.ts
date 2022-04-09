import { Movies } from './Movies.model';

export class Person{
    constructor(
        public id:number,
        public name:string,
        public friend:number[],
        public movies:Movies[]){}
}