import api from "../services/axiosInstance.js";

export const getDiscussions = (page = 1, limit = 10) => {
    return api.get(`/discussions?page=${page}&limit=${limit}`);
}

export const getDiscussionById = (id) => {
    return api.get(`/discussions/${id}`);
}

export const addDiscussion = (data) => {
    return api.post("/discussions", data);
}

export const editDiscussion = (id, data) => {
    return api.put(`/discussions/${id}`, data);
}

export const deleteDiscussion = (id) => {
    return api.delete(`/discussions/${id}`);
}

export const getComments = (id, page = 1, limit = 10) => {
    return api.get(`/discussions/${id}/comments?page=${page}&limit=${limit}`);
}

export const addComment = (id, data) => {
    return api.post(`/discussions/${id}/comments`, data);
}

export const deleteComment = (commentId) => {
    return api.delete(`/comments/${commentId}`);
}
