export const CollapsedReducer = (prevState = {
    isCollapsed: false
}, action) => {
    let { type } = action
    // 遍历每个reduce
    switch (type) {
        case "change_collapsed":
            let newsState = { ...prevState }
            newsState.isCollapsed = !newsState.isCollapsed
            return newsState
        default:
            return prevState
    }
    return prevState
}