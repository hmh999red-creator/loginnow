import axios from "axios";

export const request = (url = "", method = "get", data = {}) => {
    const fullUrl = "http://localhost:8000/api/" + url;
    
    const user = localStorage.getItem("user") || "{}";
    
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-User": user,
    };

    if (method.toLowerCase() === "get") {
        return axios.get(fullUrl, {
            params: data,
            headers: headers,
        })
        .then(res => res.data)
        .catch(error => console.log("error-log", error));
    }

    return axios({
        url: fullUrl,
        method: method,
        data: data,
        headers: headers,
    })
    .then(res => res.data)
    .catch(error => console.log("error-log", error));
};