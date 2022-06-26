const adaptiveCard = {
    "type": "AdaptiveCard",
    "body": [{
            "type": "ColumnSet",
            "columns": [{
                    "type": "Column",
                    "items": [{
                        "type": "Image",
                        "url": flight.flight.image,
                        "width": "30px",
                        "height": "30px"
                    }],
                    "width": "auto"
                },
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [{
                        "type": "TextBlock",
                        "weight": "Default",
                        "text": flight.flight.name,
                        "wrap": true,
                        "horizontalAlignment": "Left",
                        "size": "Default"
                    }]
                },
                // {
                //     "type": "Column",
                //     "width": "stretch",
                //     "items": [{
                //         "type": "TextBlock",
                //         "weight": "Bolder",
                //         "text": flight.currentStatus,
                //         "wrap": true,
                //         "horizontalAlignment": "Left",
                //         "size": "Default",
                //         "color": "Warning"
                //     }]
                // }
            ]
        },
        // {
        //     "type": "TextBlock",
        //     "text": flight.currentTask,
        //     "wrap": true
        // },
        // {
        //     "type": "FactSet",
        //     "facts": [{
        //         "title": "Flight Readiness:",
        //         "value": flight.flighReadiness
        //     }]
        // },
        {
            "type": "FactSet",
            "facts": [
                // {
                //     "title": "Tasks:",
                //     "value": flight.taskData
                // },
                // {
                //     "title": "Last updated at:",
                //     "value": flight.lastUpdateAt
                // },
                // {
                //     "title": "Updated by:",
                //     "value": flight.lastUpdateBy
                // },
                {
                    "title": "Date of departure:",
                    "value": flight.dateOfDept
                },
                {
                    "title": "STD:",
                    "value": flight.STD
                },
                {
                    "title": "Departing to:",
                    "value": flight.deptTo
                }
            ]
        }
    ],
    "actions": actions,
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.3"
}