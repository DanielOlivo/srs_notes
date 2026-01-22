export const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) => {
    return list.reduce((acc, current) => {
        const key = getKey(current)
        if(!acc[key]){
            acc[key] = []
        }
        acc[key].push(current)
        return acc
    }, {} as Record<K, T[]>)
}