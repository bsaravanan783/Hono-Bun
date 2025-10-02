interface adminInterface {
    name : string;
    email : string;
    password : string;
}

interface destinationInterface {
    name : string;
    seats : number;
    price : number;
    Discount? : number;
}

interface contentInterface {
    title : string;
    greeting? : string;
    picture? : string;  // change to URL
    description : string;
    isActive? : boolean;
}
export {adminInterface , destinationInterface , contentInterface};