import { ServiceType, SubscriptionType } from "@/types"

export function getStatus(subscription:SubscriptionType){
    const SECONDS_IN_DAY = 86400;

    if (subscription['endDate'] === 0) return "Ongoing"
    else if ((subscription['startDate'] + subscription['duration'] * SECONDS_IN_DAY) > subscription['endDate']) return "Expired" 
    else return "Canceled" 

}

var services:ServiceType[] = [
    { 
        "name": "Netflix",
        "description": "Movie streaming service for thousands of different cultures",
        "subscriptions": [
            { "user": "12bauieojgahi1bi12ugb3hu13yg12uig2j21vb12gcv", "tokenId": "1", "price": 10, "duration": 30, "startDate": 1739633084800, "endDate": 1739633084800 },
            { "user": "12bauieojASDGAagagegASFAEFEA12uig2j21vb12gcv", "tokenId": "2", "price": 30, "duration": 90, "startDate": 1739633084800, "endDate": 0 },
        ],
        "isActive": false
    },
    { 
        "name": "Spotify",
        "description": "Music subscriptions for millions of songs and tastes",
        "subscriptions": [
            { "user": "41ngajgad1s1bi12ugb3hu13yg12uig2j21vb12gcv", "tokenId": "3", "price": 50, "duration": 60, "startDate": 1739633084800, "endDate": 0 },
            { "user": "651ieojgahi1bi12ugb3hu13yg12uig2j21vb12gcv", "tokenId": "4", "price": 30, "duration": 30, "startDate": 1739633084800, "endDate": 1739633084800 },
            { "user": "712fasdb3hu13yg12uig2j21vb12XASFFAAFGAEgcv", "tokenId": "5", "price": 30, "duration": 30, "startDate": 1739633084800, "endDate": 1749633084800 },
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
    }

    return services
}