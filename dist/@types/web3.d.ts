declare module "web3/types" {
    interface Contract {
        [key: string]: any;
    }
    interface EventEmitter {
        [key: string]: any;
    }
    interface EventLog {
        [key: string]: any;
    }
    interface TransactionReceipt {
        [key: string]: any;
    }
    interface Block {
        [key: string]: any;
    }
    type BlockType = "latest" | "pending" | "genesis" | number;
}
