import { nanoid } from "nanoid";

export default function randomNumber(num:number = 10){
    return nanoid(num);
}