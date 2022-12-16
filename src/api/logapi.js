export const LogAPI = {
    baseURL: 'http://localhost:24505',
    getAllLog: (appID, onDone) => {
        fetch(LogAPI.baseURL + '/log/' + appID)
        .then(resp => resp.json())
        .then(data => {
            onDone(data);
        });
    }
};