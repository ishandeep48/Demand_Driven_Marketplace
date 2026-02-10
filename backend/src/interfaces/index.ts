import { Request } from "express";

export interface userRequest extends Request{
    user?:any;
}

export interface addressDetails{
    fullName: string;
    street:string;
    city:string;
    state:'Andhra Pradesh' | 'Arunachal Pradesh' | 'Assam' | 'Bihar' | 'Chhattisgarh' | 'Goa' | 'Gujarat' | 'Haryana' | 'Himachal Pradesh' | 'Jharkhand' | 'Karnataka' | 'Kerala' | 'Madhya Pradesh' | 'Maharashtra' | 'Manipur' | 'Meghalaya' | 'Mizoram' | 'Nagaland' | 'Odisha' | 'Punjab' | 'Rajasthan' | 'Sikkim' | 'Tamil Nadu' | 'Telangana' | 'Tripura' | 'Uttar Pradesh' | 'Uttarakhand' | 'West Bengal' | 'Andaman and Nicobar Islands' | 'Chandigarh' | 'Dadra and Nagar Haveli and Daman and Diu' | 'Delhi' | 'Jammu and Kashmir' | 'Ladakh' | 'Lakshadweep' | 'Puducherry';
    country:'India' | 'Outside';
    postalCode:string;
    phone:string;
    isDefault?:boolean;
    // user:string;
}