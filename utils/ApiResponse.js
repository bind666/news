class ApiResponse {
    status = true;
    data = null;
    message = ""

    constructor(data = null, message) {
        this.data = data;
        this.message = message;
        this.status = this.status
    }
}

export default ApiResponse;