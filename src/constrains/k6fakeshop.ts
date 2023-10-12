declare global {
    interface Product {
        readonly name: string
        readonly price: string[]
        readonly imgLink?: string
        readonly isSale: boolean
    }
} 

export const ProductSchema = {
    "type": "object",
    "required": ["name", "price", "isSale"],
    "properties": {
        "name": {
            "type": "string"
        },
        "price": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "imgLink": {
            "type": "string"
        },
        "isSale": {
            "type": "boolean"
        }
    }
}

export const ProductListSchema = {
    type: "array",
    items: {
        type: "object",
        required: [],
        properties: {
            name: {
                type: "string"
            },
            price: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            imgLink: {
                type: "string"
            },
            isSale: {
                type: "boolean"
            }
        }
    }
}
