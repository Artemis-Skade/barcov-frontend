export const post = (endpoint, data = {}) => {
    return fetch('https://' + window.Vars.domain + ':5000' + endpoint, {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
        .then(res => {
            if (res.success !== true) {
                throw new Error(res.message)
            }
        })
}
