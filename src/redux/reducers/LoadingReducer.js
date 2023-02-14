export const LoadingReducer = (prevState = {
    isLoading: true
}, action) => {
    let { type, payload } = action
    // 遍历每个reduce
    switch (type) {
        case "change_loading":
            let newsState = { ...prevState }
            newsState.isLoading = payload
            return newsState
        default:
            return prevState
    }
}