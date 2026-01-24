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
        },
        {
            lot: "LOT-2025-12",
            type: "Striploin",
            qty: 10,
            weight: 20,
            owner: "ฟาร์มสุขใจ",
            aging: "21",
            grade: "CHOICE",
        }
    ],
    "Cold Storage A1": [
        {
            lot: "LOT-2025-18",
            type: "T-Bone",
            qty: 100,
            weight: 342.5,
            owner: "ฟาร์มสุขใจ",
            aging: "21",
            grade: "CHOICE",
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