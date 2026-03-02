import type { Ease } from "./Ease";

class Field {

    private width: number;
    private height: number;

    public get Width() {
        return this.width;
    }

    public get Height() {
        return this.height;
    } 

    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
    }


}

class Card {

    private front: string;
    private back: string;
    private isOpen: boolean;
    

    public get Front() {
        return this.front;
    }

    public get Back() {
        return this.back;
    }

    public get IsOpen() {
        return this.isOpen;
    }

    constructor(front: string, back: string){
        this.front = front;
        this.back = back; 
        this.isOpen = false;
    }

    public ShowAnswer(): void {
        this.isOpen = true;
    }

    public Answer(ease: Ease): void {
         
        throw new Error();
    } 
}
