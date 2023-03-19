export const createTimeStamp = () => {
    const start = Date.now();
    const timeStamp = (stamp) => {
        console.log(stamp + '   ', Date.now() - start)
    }
    return timeStamp
}