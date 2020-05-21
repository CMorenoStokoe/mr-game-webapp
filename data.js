var data = {
    links: [
        {
            id: 1,
            from: "EGz:001",
            to: "EGz:002",
            b: -0.25
        },
        {
            id: 2,
            "from": "EGz:001",
            to: "EGz:003",
            b: 0.25
        },
        {
            id: 3,
            "from": "EGz:002",
            to: "EGz:003",
            b: 1.25
        }
    ],
    nodes: [
        {
            id: "EGz:001",
            name: "Example 1",
            label: "label_1",
            funded: false,
            units: {
                name : "units_name_1 (%)"
            },
            activation: {
                value : 1
            }
        },
        {
            id: "EGz:002",
            name: "Example 2",
            label: "label_2",
            funded: false,
            units: {
                name : "units_name_2 (/mmol)"
            },
            activation: {
                value : 2
            }
        },
        {
            id: "EG-z:003",
            name: "Example 3",
            label: "label_3",
            funded: false,
            units: {
                name : "units_name_3 (/100 people)"
            },
            activation: {
                value : 3
            }
        }
    ]
}