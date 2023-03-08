export const LogAPI = {
    baseURL: 'http://10.71.44.149:24505',
    getAllLog: (appID, onDone) => {
        fetch(LogAPI.baseURL + '/log/' + appID)
        .then(resp => resp.json())
        .then(data => {
            onDone(data);
        });
    }
};