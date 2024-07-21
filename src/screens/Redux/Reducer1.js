const initialState = {
    issues: [],
}

const Reducer1 = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_ISSUES":
            return {issues: action.payload};
            
        default:
                return state;
    };
}

export default Reducer1;