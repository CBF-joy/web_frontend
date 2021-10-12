import { API_BASE_URL, ACCESS_TOKEN} from '../constants';



const request = (options) => {
    const headers = new Headers({})

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};


const deleteRequest = (options) => {
    const headers = new Headers()

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
}


export function saveImagefile(img) {
	const formData = new FormData();
    formData.append('file', img);
    return request({
        url: API_BASE_URL + "/api/saveImagefile",
        method: 'POST',
        body: formData
    });
}

export function saveDescriptionfile(description){
const formData = new FormData();
    formData.append('desc', description);
    return request({
        url: API_BASE_URL + "/api/saveDescriptionfile",
        method:'POST',
        body: formData
    })
}


