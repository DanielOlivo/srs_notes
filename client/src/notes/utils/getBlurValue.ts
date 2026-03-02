export const getBlurValue = (duration: number) => {
    if(duration < 10000) return 0
    if(duration < 20000) return 1
    if(duration < 30000) return 2
    return 3
}