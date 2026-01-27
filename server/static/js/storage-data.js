export const storageDetail = {
    "Freezer A1": [
        {
            lot: "LOT-2025-11",
            type: "Ribeye",
            qty: 42,
            weight: 320,
            owner: "ฟาร์มโคขุนดี",
            aging: "20",
            grade: "PREMIUM",
            receivedAt: "2025-01-01",
            expireAt: "2026-02-01",

            "owner": {
                "name": "ฟาร์มโคขุนดี",
                "phone": "081-123-4524",
                "email": "santi.farm@email.com",
                "lineId": "@santifarm",
                "facebook": "ฟาร์มโคขุนสันติพะเยา",
                "memberId": "888888888888"
            }
        },
        {
            lot: "LOT-2025-12",
            type: "Striploin",
            qty: 8,
            weight: 20,
            owner: "ฟาร์มโคสุขใจ",
            aging: "21",
            grade: "CHOICE",
            receivedAt: "2025-01-05",
            expireAt: "2025-02-05",

            "owner": {
                "name": "ฟาร์มโคสุขใจ",
                "phone": "098-898-8988",
                "email": "happycow@email.com",
                "lineId": "@happycow",
                "facebook": "ฟาร์มโคสุขใจพะเยา",
                "memberId": "987654321235"
            }
        }
    ],
    "Cold Storage A1": [
        {
            lot: "LOT-2025-18",
            type: "T-Bone",
            qty: 100,
            weight: 342.5,
            owner: "ฟาร์มน้องเอื้อง",
            aging: "21",
            grade: "CHOICE",
            receivedAt: "2025-01-03",
            expireAt: "2025-03-01",

            "owner": {
                "name": "ฟาร์มน้องเอื้อง",
                "phone": "088-888-8888",
                "email": "euangnoi@email.com",
                "lineId": "@euangnoi",
                "facebook": "เอื้องดอยฟาร์ม",
                "memberId": "12345678989"
            }
        }
    ],
    "Cold Storage A2": [
        {
            lot: "LOT-2025-20",
            type: "Striploin",
            qty: 10,
            weight: 25,
            owner: "ฟาร์มสุขใจ",
            aging: "10",
            grade: "STANDARD",
            receivedAt: "2025-01-15",
            expireAt: "2025-01-30",

            "owner": {
                "name": "ฟาร์มสุขใจ",
                "phone": "088-888-8888",
                "email": "happy.farm@email.com",
                "lineId": "@happyfarm",
                "facebook": "HAPPY FARMER",
                "memberId": "576842531951"
            }
        }
    ]
};

export const storages = [
    {
        id: 1,
        name: "Freezer A1",
        type: "ตู้แช่แข็ง",
        temp: -2,
        items: 3,
        capacity: 400,
    },
    {
        id: 2,
        name: "Cold Storage A1",
        type: "ห้องเย็น",
        temp: 0,
        items: 0,
        capacity: 600,
    },
    {
        id: 3,
        name: "Cold Storage A2",
        type: "ห้องเย็น",
        temp: 4,
        items: 1,
        capacity: 800,
    }
]

