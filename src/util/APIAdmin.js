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
    const headers = new Headers({})

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
}


export function uploadFile(title, description, sponsor, fromDate, toDate, fileList){
	const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('sponsor', sponsor);
		formData.append('fromDate', fromDate);
		formData.append('toDate',toDate);
        formData.append('file', fileList);
        return request({
            url: API_BASE_URL +"/api/newAdd",
            method: 'POST',
            body : formData
        })
}


export function fetchExhibition() {
    return request({
        url: API_BASE_URL + "/api/getMyExhibition",
        method: 'GET'
    });
}

export function fetchExhibitionById(id) {
    return request({
        url: API_BASE_URL+ "/api/getExhibitionDetail/" + id,
        method: 'GET'
    });
}

export function deletePoster(id) {
    return deleteRequest({
        url:API_BASE_URL+ "/api/deletePoster/" + id,
        method: 'DELETE'
    });
}

export function fetchPosterById(id) {
    return request({
        url: API_BASE_URL + "/api/getPosterById/" + id,
        method: 'GET'
    });
}

export function editExhibition(id, title, description, fromDate, toDate ,sponsor, fileList) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);
	formData.append('sponsor',sponsor);
    formData.append('file', fileList);
    return request({
        url: API_BASE_URL+ "/api/editExhibition/" + id,
        method: 'PUT',
        body : formData
    })
}

export function editExhibitionExceptFile(id, title, description, fromDate, toDate, sponsor) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);
	formData.append('sponsor', sponsor);
    return request({
        url: API_BASE_URL+ "/api/editExhibitionExceptFile/" + id,
        method: 'PUT',
        body : formData
    })
}

export function deleteExhibition(id) {
    return deleteRequest({
        url: API_BASE_URL+"/api/deleteExhibition/" + id,
        method: 'DELETE'
    });
}

export function setStatusEnd(id){
	return request({
		url: API_BASE_URL + "/api/setStatusEnd/"+ id,
		method: 'GET'
	})
}
export function setStatusIng(id){
	return request({
		url: API_BASE_URL + "/api/setStatusIng/"+ id,
		method: 'GET'
	})
}


//등록한 작품 확인
export function getMyPainting(){
	return request({
		url : API_BASE_URL + "/api/getMyPainting/",
		method : 'GET'
	})
}

//작품 전시등록 취소
export function deletePainting(painting_id) {
    return request({
        url: API_BASE_URL + "/api/deletePainting/" + painting_id,
        method: 'DELETE'
    });
}
