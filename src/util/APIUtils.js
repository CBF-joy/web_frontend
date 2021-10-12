import { API_BASE_URL, ACCESS_TOKEN } from '../constants';
import {fetchEditEpi} from './APIAdmin';

const request = (options) => {
    const headers = new Headers({})

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

	// console.log(options.url);
	// console.log(headers);
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


//로그인&회원가입
export function login(loginRequest) {
    return request({
		headers : {'Content-Type' : 'application/json'},
        url: API_BASE_URL + "/api/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
		headers : {'Content-Type' : 'application/json'},
        url: API_BASE_URL + "/api/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}


export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/api/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/api/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: API_BASE_URL + "/api/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/api/users/" + username,
        method: 'GET'
    });
}


// 경매
export function saveAuction(token_id, owner_address, minium_price, fromDate, toDate) {
    const formData = new FormData();
    formData.append('token_id', token_id);
    formData.append('owner_address', owner_address);
    formData.append('minium_price', minium_price);
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);
	return request({
        url: API_BASE_URL + "/api/saveAuction",
        method: 'POST',
        body: formData
    });
}

export function getMyAuction() {
    return request({
        url: API_BASE_URL + "/api/getMyAuction",
        method: 'GET'
    });
}

export function deleteAuction(auction_id) {
    return request({
        url: API_BASE_URL + "/api/deleteAuction/" + auction_id,
        method: 'DELETE'
    });
}

export function getAuctionByToken(token_id) {
    return request({
        url: API_BASE_URL + "/api/getAuctionByToken/" + token_id,
        method: 'GET'
    });
}

export function setAuctionStatusIng(id) {
    return request({
        url: API_BASE_URL + "/api/setAuctionStatusIng/" + id,
        method: 'GET'
    });
}

export function setAuctionStatusEnd(id) {
    return request({
        url: API_BASE_URL + "/api/setAuctionStatusEnd/" + id,
        method: 'GET'
    });
}


export function saveSuccessfulBid(auction_id) {
    return request({
        url: API_BASE_URL + "/api/saveSuccessfulBid/"  + auction_id,
        method: 'GET'
    });
}

export function getIngAuction() {
    return request({
        url: API_BASE_URL + "/api/getIngAuction",
        method: 'GET'
    });
}

export function getMyBidByAuction(auction_id) {
    return request({
        url: API_BASE_URL + "/api/getMyBidByAuction/" + auction_id,
        method: 'GET'
    });
}

export function  editBid(auction_id, price) {
	const formData = new FormData();
    formData.append('price', price);
    return request({
        url: API_BASE_URL + "/api/editBid/"  + auction_id,
        method: 'put',
		body: formData
    });
}

export function getAvgBid(auction_id) {
    return request({
        url: API_BASE_URL + "/api/getAvgBid/"  + auction_id,
        method: 'GET'
    });
}

export function getCountBid(auction_id) {
    return request({
        url: API_BASE_URL + "/api/getCountBid/"  + auction_id,
        method: 'GET'
    });
}

export function getMaxBid(auction_id) {
    return request({
        url: API_BASE_URL + "/api/getMaxBid/"  + auction_id,
        method: 'GET'
    });
}

export function saveBid(auction_id, price) {
	 const formData = new FormData();
    formData.append('price', price);
    return request({
        url: API_BASE_URL + "/api/saveBid/"  + auction_id,
        method: 'POST',
		body: formData
    });
}

export function deleteBid(bid_id) {
    return request({
        url: API_BASE_URL + "/api/deleteBid/"  + bid_id,
        method: 'DELETE'
    });
}

export function getMyBid() {
    return request({
        url: API_BASE_URL + "/api/getMyBid",
        method: 'GET'
    });
}





//토큰 발행하면 webtoontoken 저장
export function tokenissue(epino, nft,tokenId){
    var data = JSON.stringify({
        "epino" : epino,
        "nft" : nft,
        "tokenId" : tokenId,
    })
    return request({
        contentType: "application/json",
        url: "/cash-service/pushwebtoontoken",
        method: 'POST',
        body: data
    })
}



//기부등록
export function saveDonate(painting_id,address,klay){
	const formData = new FormData();
    formData.append('address', address);
    formData.append('klay', klay);
	return request({
		url: API_BASE_URL + "/api/savePost/" + painting_id,
		method:'POST',
		body: formData
	})
}

//내 기부 조회

export function fetchDonate(){
    return request({
        url : API_BASE_URL +"/api/getMyPost" ,
        method: 'GET'
    });
}

//전시회 기부 총 금액
export function getDonateByExhibit(exhibit_id){
	return request({
		url : API_BASE_URL + "/api/getCountPostByExhibit/" + exhibit_id,
		method : 'GET'
	})
}

//전시회 기부금액순 랭킹
export function getExhibitionBySumRanking(){
	return request({
		url : API_BASE_URL + "/api/getExhibitionRankingBySumPostKlay",
		method : 'GET'
	})
}

//예정 전시회에 작품등록
export function savePainting(ex_id, title, description, file_uri, username) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file_uri', file_uri);
    formData.append('username', username);
	return request({
        url: API_BASE_URL + "/api/savePainting/" + ex_id,
        method: 'POST',
        body: formData
    });
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
    return Request({
        url: API_BASE_URL + "/api/deletePainting/" + painting_id,
        method: 'DELETE'
    });
}

//예정 전시회
export function getPreExhibition(){
	return request({
		url : API_BASE_URL + "/api/getPreExhibition/",
		method : 'GET'
	})
}

//진행중 전시회
export function getIngExhibition(){
	return request({
		url: API_BASE_URL + "/api/getIngExhibition/",
		method: 'GET'
	})
}
//진행중 전시회 상세
export function getIngExhibitionDetail(id){
	return request({
		url: API_BASE_URL + "/api/getIngExhibitionDetail/" + id,
		method: 'GET'
	})
}
//댓글 조회
export function getComment(id){
	return request({
		url: API_BASE_URL + "/api/getComment/" + id,
		method: 'GET'
	})
}

//별점 평균
export function getAvgRate(id){
	return request({
		url: API_BASE_URL + "/api/getAvgRate/"+id,
		method: 'GET'
	})
}

	
//별점 조회
export function fetchRate(id, username){
	return request({
		url: API_BASE_URL + "/api/fetchRate/"+id+"/"+username,
		method: 'GET'
		
	})
}
// 별점 등록
export function saveRate(id, username, rate){
	const formData = new FormData();
	formData.append('username', username);
	formData.append('rate', rate);
	return request({
		url: API_BASE_URL + "/api/saveRate/" + id,
		method: 'POST',
		body: formData
	})
}
// 별점 수정
export function editRate(id, username, rate){
	const formData = new FormData();
	formData.append('username', username);
	formData.append('rate', rate);
	return request({
		url: API_BASE_URL + "/api/editRate/" + id,
		method: 'PUT',
		body: formData
	})
}
// 댓글 등록
export function saveComment(id, username, comment ){
	const formData = new FormData();
	formData.append('username', username);
	formData.append('comment', comment);
	return request({
		url: API_BASE_URL + "/api/saveComment/" + id,
		method: 'POST',
		body: formData
	})
}

//댓글 수정
export function editComment(id, comment){
	const formData = new FormData();
	formData.append('comment', comment);
	return request({
		url: API_BASE_URL + "/api/editComment/" + id,
		method: 'PUT',
		body: formData
	})
}
//댓글 삭제
export function deleteComment(id){
	return deleteRequest({
		url: API_BASE_URL + "/api/deleteComment/" + id,
		method: 'DELETE'
	})
}



