// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const TestFlights = [
    {
        "Airline": "Q9",
        "FlightNumber": 300,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "LOS",
        "ArrivalStation": "ABV",
        "STDUTC": "2021-03-23T04:30:00",
        "STD": "2021-03-23T05:30:00",
        "STAUTC": "2021-03-23T06:10:00",
        "STA": "2021-03-23T07:10:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 301,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "ABV",
        "ArrivalStation": "LOS",
        "STDUTC": "2021-03-23T06:40:00",
        "STD": "2021-03-23T07:40:00",
        "STAUTC": "2021-03-23T08:10:00",
        "STA": "2021-03-23T09:10:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 302,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "LOS",
        "ArrivalStation": "ABV",
        "STDUTC": "2021-03-23T18:35:00",
        "STD": "2021-03-23T19:35:00",
        "STAUTC": "2021-03-23T20:15:00",
        "STA": "2021-03-23T21:15:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 303,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "ABV",
        "ArrivalStation": "LOS",
        "STDUTC": "2021-03-23T20:45:00",
        "STD": "2021-03-23T21:45:00",
        "STAUTC": "2021-03-23T22:15:00",
        "STA": "2021-03-23T23:15:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 304,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "LOS",
        "ArrivalStation": "ILR",
        "STDUTC": "2021-03-23T06:00:00",
        "STD": "2021-03-23T07:00:00",
        "STAUTC": "2021-03-23T07:05:00",
        "STA": "2021-03-23T08:05:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 305,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "ILR",
        "ArrivalStation": "LOS",
        "STDUTC": "2021-03-23T07:35:00",
        "STD": "2021-03-23T08:35:00",
        "STAUTC": "2021-03-23T08:30:00",
        "STA": "2021-03-23T09:30:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 306,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "LOS",
        "ArrivalStation": "AKR",
        "STDUTC": "2021-03-23T11:45:00",
        "STD": "2021-03-23T12:45:00",
        "STAUTC": "2021-03-23T12:45:00",
        "STA": "2021-03-23T13:45:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 307,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "AKR",
        "ArrivalStation": "LOS",
        "STDUTC": "2021-03-23T13:15:00",
        "STD": "2021-03-23T14:15:00",
        "STAUTC": "2021-03-23T14:10:00",
        "STA": "2021-03-23T15:10:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 320,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "LOS",
        "ArrivalStation": "PHC",
        "STDUTC": "2021-03-23T05:30:00",
        "STD": "2021-03-23T06:30:00",
        "STAUTC": "2021-03-23T06:50:00",
        "STA": "2021-03-23T07:50:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 321,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "PHC",
        "ArrivalStation": "LOS",
        "STDUTC": "2021-03-23T07:20:00",
        "STD": "2021-03-23T08:20:00",
        "STAUTC": "2021-03-23T08:45:00",
        "STA": "2021-03-23T09:45:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 322,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "LOS",
        "ArrivalStation": "PHC",
        "STDUTC": "2021-03-23T18:20:00",
        "STD": "2021-03-23T19:20:00",
        "STAUTC": "2021-03-23T19:40:00",
        "STA": "2021-03-23T20:40:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 323,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "PHC",
        "ArrivalStation": "LOS",
        "STDUTC": "2021-03-23T20:10:00",
        "STD": "2021-03-23T21:10:00",
        "STAUTC": "2021-03-23T21:35:00",
        "STA": "2021-03-23T22:35:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 324,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "LOS",
        "ArrivalStation": "QOW",
        "STDUTC": "2021-03-23T09:00:00",
        "STD": "2021-03-23T10:00:00",
        "STAUTC": "2021-03-23T10:25:00",
        "STA": "2021-03-23T11:25:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 325,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "QOW",
        "ArrivalStation": "LOS",
        "STDUTC": "2021-03-23T10:55:00",
        "STD": "2021-03-23T11:55:00",
        "STAUTC": "2021-03-23T12:20:00",
        "STA": "2021-03-23T13:20:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 326,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "LOS",
        "ArrivalStation": "QOW",
        "STDUTC": "2021-03-23T14:30:00",
        "STD": "2021-03-23T15:30:00",
        "STAUTC": "2021-03-23T15:55:00",
        "STA": "2021-03-23T16:55:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 327,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "QOW",
        "ArrivalStation": "LOS",
        "STDUTC": "2021-03-23T16:25:00",
        "STD": "2021-03-23T17:25:00",
        "STAUTC": "2021-03-23T17:50:00",
        "STA": "2021-03-23T18:50:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 328,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "LOS",
        "ArrivalStation": "ENU",
        "STDUTC": "2021-03-23T14:40:00",
        "STD": "2021-03-23T15:40:00",
        "STAUTC": "2021-03-23T16:10:00",
        "STA": "2021-03-23T17:10:00"
    },
    {
        "Airline": "Q9",
        "FlightNumber": 329,
        "DepartureDate": "3/23/2021 12:00:00 AM",
        "DepartureStation": "ENU",
        "ArrivalStation": "LOS",
        "STDUTC": "2021-03-23T16:40:00",
        "STD": "2021-03-23T17:40:00",
        "STAUTC": "2021-03-23T18:10:00",
        "STA": "2021-03-23T19:10:00"
    }
]

module.exports.TestFlights = TestFlights;