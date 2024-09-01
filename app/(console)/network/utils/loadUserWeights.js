import { getUserPhotoSizes } from "@/app/api/UserAPI";

async function loadStegoCountPerUsers(socialNetwork, model) {
    console.log('here')
    const topUsers = socialNetwork.get_top_users('degree', 2);
    const photoSizes = await Promise.all(topUsers.map(async userID => {
        return await getUserPhotoSizes(
            userID, 
            10, 
            Date.parse('1970-01-01'), 
            Date.parse('3000-01-01')
        );
    }))
    console.log(topUsers)
    return {}
}

export function loadUserWeights(socialNetwork, size, model) {
    if (!model) return {};
    if (size == 'stego-count') {
        return loadStegoCountPerUsers(socialNetwork)
    }
    return {}
}
