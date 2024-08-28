function loadStegoCountPerUsers(socialNetwork) {
    const topUsers = socialNetwork.getTopUsers('degree', 10);
    return {}
}

export function loadUserWeights(socialNetwork, size) {
    if (size == 'stego-count') {
        return loadStegoCountPerUsers(socialNetwork)
    }
    return {}
}
