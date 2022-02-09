class Result {
  status = true;
  message = "";
  data = null;

  /**
   *
   * @param status
   * @param message
   * @param data
   */
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  /**
   *
   * @returns {{data: null, message: string, status: boolean}}
   */
  send() {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
    };
  }
}

module.exports = Result;
