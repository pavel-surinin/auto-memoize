const presets = [
    [
        "@babel/env",
        {
            targets: {
                browsers: [
                    ">0.5%",
                    "last 2 versions",
                    "Firefox ESR", 
                    "not dead"
                ],
            },
            useBuiltIns: "usage",
        },
    ]
];

module.exports = { presets };