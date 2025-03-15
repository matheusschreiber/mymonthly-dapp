import { ServiceType, SubscriptionType } from "@/types"

export function getStatus(subscription:SubscriptionType){
    const MILISECONDS_IN_DAY = 60*60*24*1000;

    if (new Date(subscription['endDate']) > new Date()) return "Ongoing"
    else if ((subscription['startDate'] + subscription['duration'] * MILISECONDS_IN_DAY) <= subscription['endDate']) return "Expired" 
    else if (new Date(subscription['endDate']) < new Date()) return "Canceled"
    else return "Error" 

}

var services:ServiceType[] = [
    { 
        "name": "Netflix",
        "description": "Movie streaming service for thousands of different cultures",
        "subscriptions": [
            { "user": "12bauieojgahi1bi12ugb3hu13yg12uig2j21vb12gcv", "tokenId": "1", "price": 10, "duration": 30, "startDate": 1742052307144, "endDate": 1744644307144 }, // ongoing
            { "user": "12bauieojASDGAagagegASFAEFEA12uig2j21vb12gcv", "tokenId": "2", "price": 30, "duration": 90, "startDate": 1739633084800, "endDate": 1747751084800 }, // ongoing
        ],
        "isActive": false
    },
    { 
        "name": "Spotify",
        "description": "Music subscriptions for millions of songs and tastes",
        "subscriptions": [
            { "user": "12bauieojgahi1bi12ugb3hu13yg12uig2j21vb12gcv", "tokenId": "3", "price": 50, "duration": 60, "startDate": 1742052307144, "endDate": 1744644307144 }, // ongoing
            { "user": "12bauieojgahi1bi12ugb3hu13yg12uig2j21vb12gcv", "tokenId": "4", "price": 30, "duration": 30, "startDate": 1739460307144, "endDate": 1742052307144 }, // expired
            { "user": "12bauieojgahi1bi12ugb3hu13yg12uig2j21vb12gcv", "tokenId": "5", "price": 30, "duration": 30, "startDate": 1739460307144, "endDate": 1740756307144 }, // canceled
        ],
        "isActive": true
    },
    { 
        "name": "Twitch",
        "description": "Live streaming service for gamers and content creators",
        "subscriptions": [
            { "user": "1r41daajgad1s1bi12ugb3hu13yg12uig2j21vb12gcv", "tokenId": "5", "price": 50, "duration": 60, "startDate": 1742052307144, "endDate": 1744644307144 }, // ongoing
            { "user": "12bauieojgahi1bi12ugb3hu13yg12uig2j21vb12gcv", "tokenId": "6", "price": 30, "duration": 30, "startDate": 1739460307144, "endDate": 1742052307144 }, // expired
            { "user": "712fasdb3hu13yg12uig2j21vgab12XASFFAAFGAEgcv", "tokenId": "7", "price": 30, "duration": 30, "startDate": 1739460307144, "endDate": 1740756307144 }, // canceled
        ],
        "isActive": true
    },
]

export function getServices() {
    for(let i=0; i<services.length; i++) {
        services[i]['metadata'] = {
            "subscribers": {
                "ongoing": services[i]['subscriptions'].filter((sub: any) => getStatus(sub) == 'Ongoing').length,
                "expired": services[i]['subscriptions'].filter((sub: any) => getStatus(sub) == 'Expired').length,
                "canceled": services[i]['subscriptions'].filter((sub: any) => getStatus(sub) == 'Canceled').length,
            }
        }
        services[i]['subscriptions'] = services[i]['subscriptions'].map((sub: any) => {
            sub['service'] = services[i]['name']
            return sub
        })
    }

    return services
}