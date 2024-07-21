export const addIssues = (issue) => {
    return {
        type: 'ADD_ISSUES',
        payload: issue,
    };
};