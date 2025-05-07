
export interface Service {
    // the code hash of the service
    code: string;

    // the balance of the service account
    balance: number;

    // the gas limit of the service account 
    gas: number;

    // the total number of octets used in storage
    total: number;

    // the number of items in storage
    items: number;
}

export interface ServiceData {
    service: Service,
    // an array of preimage hashes
    preimages: string[];
}

export interface ServiceItem {
    service: number;
    data: ServiceData;
}